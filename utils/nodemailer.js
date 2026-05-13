const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,

    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
// console.log(transporter)

const sendMail = async (options) => {
    try {
        const info = await transporter.sendMail({
            from: `"OLACHI" <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Message sent to: %s", options.email);
    } catch (error) {
        console.log("Error while sending mail:", error.message);
    }
}

module.exports = sendMail;