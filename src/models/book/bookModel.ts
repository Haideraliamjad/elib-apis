import mongoose from "mongoose";
import { user } from "../user/userModel";
interface bookModelInterface {
  _id: string;
  title: String;
  author: user;
  gener: String;
  coverImage: String;
  bookfile: String;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new mongoose.Schema<bookModelInterface>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true },
    gener: { type: String, required: true },
    coverImage: { type: String, required: true },
    bookfile: { type: String, required: true },
  },
  { timestamps: true }
);

const bookModel = mongoose.model("book", bookSchema);
export { bookModel };
