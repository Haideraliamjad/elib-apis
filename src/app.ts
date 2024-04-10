import express from 'express'
import globalErrorHandler from '../src/middlewares/globalErrorHandler'
const app = express()

// Routes
app.get('/',(req,res,next) => { 
    res.json({
        'messege' : 'welcome to elib-apis'
    })
})

// Global error handler
app.use(globalErrorHandler)

export default app
