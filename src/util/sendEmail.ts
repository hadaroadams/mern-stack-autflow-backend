import nodemailer from "nodemailer";
import nodemailerConfig from "../config/nodemailerConfig";

interface SendEmail {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: SendEmail) => {
  let testAcount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);
  return transporter.sendMail({
    from: '"Hadaro Adams" <hadaroadams1234@gmail.com',
    to,
    subject,
    html,
  });
};

export default sendEmail;