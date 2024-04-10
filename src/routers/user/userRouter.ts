import { Router } from "express";
import { registerUser } from "../../controllers/user/userController";
const userRouter = Router();
userRouter.post("/users/register", registerUser);
export { userRouter };
