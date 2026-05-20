import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async (to,otp)=>{
  transporter.sendMail({
    from: process.env.EMAIL,
    to: to,
    subject: "VIBE Password Reset OTP",
    html: `<p>Your OTP for password reset is <b>${otp}</b> valid for 2 minutes only ...</p>`,
  });
}

export default sendMail;