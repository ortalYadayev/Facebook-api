import Mail from 'nodemailer/lib/mailer';

declare module 'nodemailer' {
  const mock: {
    reset(): void;
    getSentMail(): Mail.Options[];
  };

  // eslint-disable-next-line import/prefer-default-export
  export { mock };
}
