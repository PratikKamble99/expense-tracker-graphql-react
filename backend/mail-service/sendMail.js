import nodemailer from "nodemailer";

const port = 587;

export const getTransporter = () => {
  let transporter;

  transporter = nodemailer.createTransport({
    service:'gmail',
    host: process.env.NODEMAILER_HOST,
    port: port,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_USER_EMAIL,
      pass: process.env.NODEMAILER_USER_EMAIL_PASSWORD,
    },
  });

  return transporter;
};
