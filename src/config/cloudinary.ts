import { v2 as cloudinary } from "cloudinary";
import { config } from "./config";
cloudinary.config({
  cloud_name: config.cloudinaryname,
  api_key: config.cloudinaryapikey,
  api_secret: config.cloudinaryapisecrete,
});
export default cloudinary;
