import express from 'express'
import globalErrorHandler from '../src/middlewares/globalErrorHandler'
import { userRouter } from './routers/user/userRouter'
const app = express()
app.use(express.json({}))
// Routes
app.use('/api',userRouter)

// Global error handler
app.use(globalErrorHandler)

export default app
