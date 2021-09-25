import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// eslint-disable-next-line import/prefer-default-export
export function sendMail(
  mailOptions: Omit<Mail.Options, 'from'>,
): Promise<SMTPTransport.SentMessageInfo> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || ''),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  return transporter.sendMail({
    ...mailOptions,
    from: process.env.MAIL_FROM,
  });
}
