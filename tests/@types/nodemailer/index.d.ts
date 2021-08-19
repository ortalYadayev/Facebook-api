/// <reference types="node" />

declare module 'nodemailer' {
  import Mail from "nodemailer/lib/mailer";

  interface mock2 {
    reset(): void;
    getSentMail(): Mail.Options[]
  }

  const mock: mock2;

  export {
    mock,
  };
}
