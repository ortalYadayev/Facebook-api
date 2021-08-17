import nodemailer from "nodemailer";
import * as Process from "process";
import Mail from "nodemailer/lib/mailer";

export function sendMail(mailOptions: Omit<Mail.Options, "from">) {
  let transporter = nodemailer.createTransport({
    host: Process.env.MAIL_HOST,
    port: parseInt(Process.env.MAIL_PORT),
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
