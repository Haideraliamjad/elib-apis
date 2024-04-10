import { config as conf } from "dotenv";
interface congifTypes {
    port? : String;
    databaseurl? : String;
}   
conf()
const _config : congifTypes = {
    port : process.env.PORT,
    databaseurl : process.env.MONGO_CONNECTION_STRING
}
export const config = Object.freeze(_config)
