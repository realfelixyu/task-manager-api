const express = require('express')
//require basically runs the imported script
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const MAINTENANCE = false;

const app = express()
const port = process.env.PORT

const multer = require('multer')
const upload = multer({
    dest: 'images'
})

//has to call next to tell express that we're done with middle ware
// app.use((req, res, next) => {
//     if (req.method === "GET") {

//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     if (MAINTENANCE) {
//         return res.status(503).send("SITE IS CURRENTLY DOWN FOR MAINTENANCE, check back soon!")
//     }
//     next()
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('server listening on', port)
})

const jwt = require('jsonwebtoken')


