import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export function sendMail(mailOptions: Omit<Mail.Options, "from">) {
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || ''),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });

  return transporter.sendMail({
    ...mailOptions,
    from: process.env.MAIL_FROM
  });
}
