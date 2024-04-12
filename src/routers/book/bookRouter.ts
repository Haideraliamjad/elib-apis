import { Router } from "express";
import path from "node:path";
import { createBook } from "../../controllers/book/bookController";
import multer from "multer";
import { authenticate } from "../../middlewares/authenticate";
const bookRouter = Router();
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

bookRouter.post(
  "/books/create",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  createBook
);

export { bookRouter };
