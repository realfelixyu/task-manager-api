const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //reference to the User model
        ref: 'User'
    }
}, {
    timestamps: true
})

//specify model for a new data base
const Task = mongoose.model('Task', taskSchema)

module.exports = Task;

