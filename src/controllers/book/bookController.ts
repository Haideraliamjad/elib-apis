import { Request, Response, NextFunction } from "express";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  return res.json({ message: "welcomes" });
};
export { createBook };
