const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'felixy2232@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app ${name}. Let me know how you get along with the app.`
    })
}

const cancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'felixy2232@gmail.com',
        subject: 'Sorry that you\'re leaving',
        text: `Hey ${name}, do you have any feedback for us?`
    })
}

//export an object because we want to use multiple functions from this file
module.exports = {
    sendWelcomeEmail,
    cancelEmail
}
