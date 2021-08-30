import Mail from 'nodemailer/lib/mailer';

declare module 'nodemailer' {
  const mock: {
    reset(): void;
    getSentMail(): Mail.Options[];
  };

  export { mock };
}
