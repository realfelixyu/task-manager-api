const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(env.process.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
})



