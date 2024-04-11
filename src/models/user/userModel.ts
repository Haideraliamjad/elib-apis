import mongoose from "mongoose";

export interface user {
  _id: String;
  name: String;
  email: String;
  password: String;
}

const userSchema = new mongoose.Schema<user>(
  {
    name: { type: String, require: true, trim: true },
    email: { type: String, require: true, trim: true, unique: true },
    password: { type: String, require: true },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

export { userModel };
