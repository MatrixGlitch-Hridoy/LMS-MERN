require("dotenv").config();
import { IActivationToken, IRegisterUser } from "../types/auth.type";
import jwt, { Secret } from "jsonwebtoken";
export const createActivationToken = (
  user: IRegisterUser
): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};
