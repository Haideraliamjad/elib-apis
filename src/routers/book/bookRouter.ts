import { Router } from "express";
import path from "node:path";
import { createBook } from "../../controllers/book/bookController";
import multer from "multer";
const bookRouter = Router();
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

bookRouter.post(
  "/books/create",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookfile", maxCount: 1 },
  ]),
  createBook
);

export { bookRouter };
