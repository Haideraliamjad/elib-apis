import { Router } from "express";
import { createBook } from "../../controllers/book/bookController";
const bookRouter = Router();
bookRouter.post("/books/create", createBook);

export { bookRouter };
