import { config as conf } from "dotenv";

conf();
const _config = {
  port: process.env.PORT,
  databaseurl: process.env.MONGO_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  jwtsecrete: process.env.JWT_SECRETE,
  cloudinaryname: process.env.CLOUDINARY_NAME,
  cloudinaryapikey: process.env.CLOUDINARY_API_KEY,
  cloudinaryapisecrete: process.env.CLOUDINARY_API_SECRET,
};
export const config = Object.freeze(_config);
