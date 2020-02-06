

const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'jeni.srivastava09@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`  //back ticks can be used for directly puting the variables in the sentence
    })
}
const sendExitEmail=(email,name)=>
{
    sgMail.send({
        to:email,
        from:'jeni.srivastava09@gmail.com',
        subject:'for uninstaling our service',
        text:`Dear ${name}, please let us know what can be done to get you back`
    })

}
module.exports = {
    sendWelcomeEmail,
    sendExitEmail
  
}
