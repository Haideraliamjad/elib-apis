import { Request, Response, NextFunction } from "express";
import cloudinary from "../../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import fs from "node:fs";
import { bookModel } from "../../models/book/bookModel";
import { AuthRequest } from "../../middlewares/authenticate";

// create book function
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const { title, gener } = req.body;
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    const bookFileName = files.bookFile[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    console.log(bookFileName, bookFilePath);
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );
    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      gener,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      bookFile: bookFileUploadResult.secure_url,
    });

    // deleting temp files
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    return res.status(201).json({ id: newBook._id });
  } catch (error) {
    return next(createHttpError(500, "file uploading error"));
  }
};

// Update Book function
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }

  // Check access
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "You can not update others book."));
  }

  // check if image field is exists.

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let completeCoverImage = "";
  if (files.coverImage) {
    const filename = files.coverImage[0].filename;
    const converMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    // send files to cloudinary
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads/" + filename
    );
    completeCoverImage = filename;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: completeCoverImage,
      folder: "book-covers",
      format: converMimeType,
    });

    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  // check if file field is exists.
  let completeFileName = "";
  if (files.bookFile) {
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads/" + files.bookFile[0].filename
    );

    const bookFileName = files.bookFile[0].filename;
    completeFileName = bookFileName;

    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "book-pdfs",
      format: "pdf",
    });

    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      bookFile: completeFileName ? completeFileName : book.bookFile,
    },
    { new: true }
  );

  return res.json(updatedBook);
};

// function to get list of books
const getBookslist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const books = await bookModel.find();
    return res.json(books);
  } catch (error) {
    return next(createHttpError(500, "error while getting book"));
  }
};

// function to get single book
const getSingleBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.bookId;
    const books = await bookModel.findOne({ _id: id });
    if (!books) {
      return next(createHttpError(404, "book not found"));
    }
    return res.json(books);
  } catch (error) {
    return next(createHttpError(500, "error while getting book"));
  }
};

// function to delete book
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.bookId;
    const books = await bookModel.findOne({ _id: id });
    if (!books) {
      return next(createHttpError(404, "book not found"));
    }
    const _req = req as AuthRequest;
    if (books.author.toString() !== _req.userId) {
      return next(createHttpError(403, "you cannot change other people books"));
    }

    const coverFileSplits = books.coverImage.split("/");
    const coverImagePublicId =
      coverFileSplits.at(-2) + "/" + coverFileSplits.at(-1)?.split(".").at(-2);

    const bookFileSplits = books.bookFile.split("/");
    const bookFilePublicId =
      bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);
    console.log("bookFilePublicId", bookFilePublicId);
    // todo: add try error block
    await cloudinary.uploader.destroy(coverImagePublicId);
    await cloudinary.uploader.destroy(bookFilePublicId, {
      resource_type: "raw",
    });

    await bookModel.deleteOne({ _id: id });

    return res.sendStatus(204);
  } catch (error) {
    return next(createHttpError(500, "error while deleting book"));
  }
};

export { createBook, updateBook, getBookslist, getSingleBooks, deleteBook };
