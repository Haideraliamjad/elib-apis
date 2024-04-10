import mongoose from "mongoose"
import { config } from "./config"
const connectDB = async () => {
   try {

    mongoose.connection.on('connected',() => {
        console.log('database connection successfull')
    })

    mongoose.connection.on('error',(err) => {
        console.error('error in connecting to database',err)
    })
    await mongoose.connect(config.databaseurl as string)

   } catch (error) {
     console.error('fail to connect to database',error)
     process.exit(1)
   }    
}

export default connectDB