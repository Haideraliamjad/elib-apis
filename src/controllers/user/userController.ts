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
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  const user = await userModel.findOne({ email: email });
  if (user) {
    const error = createHttpError(400, "user already register");
    return next(error);
  }
  let newUser = null;
  try {
    const hashPassword = await bcrypt.hash(password, 10);

    newUser = await userModel.create({
      name,
      password: hashPassword,
      email,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while registering user"));
  }
  try {
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
    return next(createHttpError(500, "error while generating access token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createHttpError(400, "email and password required"));
  }
  try {
    const user: any = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "user not found"));
    }
    const hashPassword = user.password;
    const isPasswordTrue = await bcrypt.compare(password, hashPassword);

    if (!isPasswordTrue) {
      return next(createHttpError(400, "invalid email or password"));
    }

    const token = sign(
      {
        sub: user._id,
      },
      config.jwtsecrete as string,
      {
        expiresIn: "7d",
      }
    );
    return res.json({ id: user._id, token });
  } catch (error) {
    return next(createHttpError(500, "error while login user"));
  }
};

export { registerUser, loginUser };
