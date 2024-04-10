import { config as conf } from "dotenv";
interface congifTypes {
  port?: String;
  databaseurl?: String;
  env?: String;
  jwtsecrete?: string;
}
conf();
const _config: congifTypes = {
  port: process.env.PORT,
  databaseurl: process.env.MONGO_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  jwtsecrete: process.env.JWT_SECRETE,
};
export const config = Object.freeze(_config);
