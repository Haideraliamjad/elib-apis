import { Request, Response, NextFunction } from "express";
import cloudinary from "../../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import fs from "node:fs";
import { bookModel } from "../../models/book/bookModel";
import { AuthRequest } from "../../middlewares/authenticate";
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
export { createBook };
