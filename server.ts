import app from './src/app'
import { config } from './src/config/config'
const startServer = () => {
    const portNumber = config.port || 3000
    app.listen(portNumber,() => {
        console.log(`listining on ${portNumber}`)
    })
}
startServer()