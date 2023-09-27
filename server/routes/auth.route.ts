import express from "express";
import { authController } from "../controllers/auth/auth.controller";
export const authRouter = express.Router();

authRouter.post("/register", authController.registerUser);
authRouter.post("/activate-user", authController.activateUser);
