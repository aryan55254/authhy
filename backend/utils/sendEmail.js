//send otp to email
const nodemailer = require("nodemailer");
require("dotenv").config();
const sendEmail = async (email, mailSubject, mailBody) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "Your App <noreply@yourapp.com>",
      to: email,
      subject: mailSubject,
      text: mailBody,
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error("failed to send email");
  }
};
module.exports = sendEmail;
