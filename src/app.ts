import express from 'express'
const app = express()

// Routes
app.get('/',(req,res,next) => {
    res.json({
        'messege' : 'welcome to elib-apis'
    })
})

export default app
