import app from './src/app'
import { config } from './src/config/config'
import connectDB from './src/config/db'
const startServer = async () => {
    await connectDB()
    const portNumber = config.port || 3000
    app.listen(portNumber,() => {
        console.log(`listining on ${portNumber}`)
    })
}
startServer()