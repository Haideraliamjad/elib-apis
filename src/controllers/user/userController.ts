import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { userModel } from "../../models/user/userModel";
import { sign } from "jsonwebtoken";
import { config } from "../../config/config";
import bcrypt from "bcrypt";

// Register User
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      const error = createHttpError(400, "All fields are required");
      return next(error);
    }
    const user = await userModel.findOne({ email: email });
    if (user) {
      const error = createHttpError(400, "user already register");
      next(error);
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      password: hashPassword,
      email,
    });
    const token = sign(
      {
        sub: newUser._id,
      },
      config.jwtsecrete as string,
      {
        expiresIn: "7d",
      }
    );
    return res.json({ id: newUser._id, token });
  } catch (error) {
    return next(error);
  }
};

export { registerUser };
