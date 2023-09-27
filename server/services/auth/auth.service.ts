import { StringExpression } from "mongoose";
import catchAsyncError from "../../middlewares/catch-async-errors";
import userModel from "../../models/user.model";

export const isEmailExitsService = async (email: string) => {
  const user = await userModel.findOne({ email });
  return !!user;
};

export const registerUserService = async (
  name: string,
  email: string,
  password: string
) => {
  const user = await userModel.create({
    name,
    email,
    password,
  });
  return user;
};
