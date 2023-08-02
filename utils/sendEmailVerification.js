const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure : false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});
function sendVerificationEmail(email,verificationToken){
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Email Verification',
        html: `<p>Click <a href="${process.env.HOST}/api/user/verify/${verificationToken}">here</a> to verify your email.</p>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });
}

module.exports = {sendVerificationEmail};