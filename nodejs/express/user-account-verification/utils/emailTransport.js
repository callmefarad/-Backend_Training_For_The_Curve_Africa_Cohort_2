require( 'dotenv' ).config();
const nodemailer = require( 'nodemailer' );

// function that transports email
const emailTransporter = async (options) => {
    const transporter = nodemailer.createTransport( {
        host: "smtp.mailtrap.io",
        port: 2525,
            auth: {
                user: process.env.MAIL_TRAP_USERNAME,
        pass: process.env.MAIL_TRAP_PASSWORD
    }
    } );
    
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }
  main().catch(console.error);
};

module.exports = {emailTransporter}