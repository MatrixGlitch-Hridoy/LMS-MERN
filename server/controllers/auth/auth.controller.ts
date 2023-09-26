import { NextFunction, Request, Response } from "express";
import ejs from "ejs";
import catchAsyncError from "../../middlewares/catch-async-errors";
import { isEmailExitsService } from "../../services/auth/auth.service";
import ErrorHandler from "../../utils/Error-handler";
import { IRegisterUser } from "../../types/auth.type";
import { createActivationToken } from "../../utils/utility-functions";
import path from "path";
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

        // const html = await ejs.renderFile(
        //   path.join(__dirname, "../../mails/activation-mail.ejs"),
        //   data
        // );
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
};
