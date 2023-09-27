import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../../middlewares/catch-async-errors";
import {
  isEmailExitsService,
  registerUserService,
} from "../../services/auth/auth.service";
import ErrorHandler from "../../utils/Error-handler";
import { IRegisterUser } from "../../types/auth.type";
import {
  createActivationToken,
  verifyToken,
} from "../../utils/utility-functions";
import sendMail from "../../utils/sendMail";

export const authController = {
  registerUser: catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name, email, password } = req.body;
        // Checking database for existing email
        const isEmailExits = await isEmailExitsService(email);
        if (isEmailExits) {
          return next(new ErrorHandler("Email already exits", 400));
        }
        const user: IRegisterUser = {
          name,
          email,
          password,
        };
        // Creating activation token
        const activationToken = createActivationToken(user);
        const data = {
          user: {
            name: user.name,
          },
          activationCode: activationToken.activationCode,
        };
        // Sending Mail
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  ),
  activateUser: catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token, activation_code } = req.body;
        const userInfo = verifyToken(token);
        if (userInfo.activationCode !== activation_code) {
          return next(new ErrorHandler("Invalid activation code", 400));
        }
        const { name, email, password } = userInfo.user;
        const user = await registerUserService(name, email, password);
        res.status(201).json({
          success: true,
          message: "User Created",
          user,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  ),
};
