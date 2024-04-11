import { Router } from "express";
import { registerUser, loginUser } from "../../controllers/user/userController";
const userRouter = Router();
userRouter.post("/users/register", registerUser);
userRouter.post("/users/login", loginUser);
export { userRouter };
