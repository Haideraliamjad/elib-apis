import { Router } from "express";
import path from "node:path";
import {
  createBook,
  updateBook,
  getBookslist,
  getSingleBooks,
  deleteBook,
} from "../../controllers/book/bookController";
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

bookRouter.patch(
  "/books/update/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  updateBook
);

bookRouter.get("/books", getBookslist);
bookRouter.get("/books/:bookId", getSingleBooks);
bookRouter.delete("/books/delete/:bookId", authenticate, deleteBook);
export { bookRouter };
