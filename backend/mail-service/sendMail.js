import nodemailer from "nodemailer";

const host = "smtp.gmail.com";
const port = 587;
const from = "kamblepratik1137@gmail.com";
const password = "PPK@0909";

export const getTransporter = () => {
  let transporter;

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "maddison53@ethereal.email",
      pass: "jn7jnAPss4f63QBp6D",
    },
  });

  return transporter;
};
