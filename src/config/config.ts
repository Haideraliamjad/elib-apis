import { config as conf } from "dotenv";
interface congifTypes {
    port? : String;
}
conf()
const _config : congifTypes = {
    port : process.env.PORT
}
export const config = Object.freeze(_config)
