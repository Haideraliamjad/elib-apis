import express from "express";
import globalErrorHandler from "../src/middlewares/globalErrorHandler";
import { userRouter } from "./routers/user/userRouter";
import { bookRouter } from "./routers/book/bookRouter";
import { config } from "./config/config";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: config.frontenddomain,
  })
);
app.use(express.json({}));
// Routes
app.use("/api", userRouter);
app.use("/api", bookRouter);
// Global error handler
app.use(globalErrorHandler);

export default app;
