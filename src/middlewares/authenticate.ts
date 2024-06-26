import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  console.log("authenticate");
  const token = req.header("Authorization");
  if (!token) {
    return next(createHttpError(401, "Not Authenticated"));
  }
  const parsedToken = token.split(" ")[1];
  try {
    const decoded = verify(parsedToken, config.jwtsecrete as string);
    const _req = req as AuthRequest;
    _req.userId = decoded.sub as string;
  } catch (error) {
    return next(createHttpError(401, "Token Expired"));
  }
  next();
};
export { authenticate };
