import express, { NextFunction, Request, Response } from "express";
require("dotenv").config();
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorMiddleWare from "./middlewares/error";
import { router } from "./routes";

// Body Parser
app.use(express.json({ limit: "50mb" }));

// Cookie Parser
app.use(cookieParser());

// Cors
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// Routes
app.use(router);

// Health Check
app.get(
  "/health-check",
  (_req: Request, res: Response, _next: NextFunction) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: "OK",
      timestamp: Date.now(),
    };
    try {
      res.send(healthcheck);
    } catch (error: any) {
      healthcheck.message = error.message;
      res.status(503).send();
    }
  }
);

// Invalid Url
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} not found`) as any;
  error.statusCode = 404;
  next(error);
});

app.use(ErrorMiddleWare);
