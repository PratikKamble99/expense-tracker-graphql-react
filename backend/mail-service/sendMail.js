import nodemailer from 'nodemailer';

const host = "smtp.gmail.com";
const port = 587;
const from = "kamblepratik1137@gmail.com";
const password = "PPK@0909";

export const getTransporter = () => {
  let transporter;

  transporter = nodemailer.createTransport({
    service: "gmail",
    host: host,
    port: port,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: from,
      pass: password,
    },
  });

  return transporter;
};

