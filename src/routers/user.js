const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, cancelEmail} = require('../emails/account')

const auth = require('../middleware/auth')

//adding async causes function to return a promise but in this case we aren't
//returning anything anyways
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    //if this fails then the rest doesnt run
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }

    // user.status(201).save().then(() => {
    //     res.send(user)
    // }).catch((error) => {
    //     //gotta set status first
    //     res.status(400).send(error)
    // })
})

//will run middleware then async func gets called by middleware's next()
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const foundUser = await User.findById(_id)
//         if (!foundUser) {
//             return res.status(400).send()
//         }
//         res.send(foundUser)
//     } catch (e) {
//         res.status(400).send()
//     }
// })

router.post('/users/login', async (req ,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

//patch is for updating resource
router.patch('/users/me', auth, async (req, res) => {
    const _id = req.user.id
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) =>  {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({error : 'invalid updates'})
    }

    try {
        //req.body is the obj that contains updates
        //const user = await User.findByIdAndUpdate(_id, req.body, { new : true, runValidators: true })
        // const user = await User.findById(_id)
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req,res) => {

    try {
        await req.user.remove()
        cancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

//middleware
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image.'))
        }
        cb(undefined, true)
        // //reject with error
        // cb(new Error('File must be a PDF'))
        // //accept
        // cb(undefined, true)
        // //reject silently
        // cb(undefined, false)
    }
})

//we arent sending json thats why we specific /avatar which is a different request
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    //.buffer is all the binary data
    //req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    //make sure have all 4 arguments so express knows that this is error callback
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router
