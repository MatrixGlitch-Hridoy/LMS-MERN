import { StringExpression } from "mongoose";
import catchAsyncError from "../../middlewares/catch-async-errors";
import userModel from "../../models/user.model";

export const isEmailExitsService = async (email: string) => {
  const user = await userModel.findOne({ email });
  return !!user;
};
