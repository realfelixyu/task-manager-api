//CRUD - create read update delete

const {MongoClient, ObjectID} = require('mongodb')

//127.0.0.1 is better than using localhost for some reason
const connectionURL = process.env.MONGODB_URL
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('unable to connect to database!')
    }
    const db = client.db(databaseName)
    
    // db.collection('users').findOne({name: 'Jen'}, (error, user) => {
    //     if (error) {
    //         console.log('unable to fetch')
    //     }
    //     console.log(user)
    // })

    // db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
    //     console.log(tasks)
    // })

    // db.collection('tasks').updateOne({
    //     _id : new ObjectId("5ec8bcd34a6a3e01d10a10ba")
    // }, {
    //     $set: {
    //         completed: 'false'
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('tasks').deleteMany({
        description: 'des 1'
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
})
