import {DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions} from "fastify";
import {User} from "../entities/user.entity";
import {Static, Type} from '@sinclair/typebox'
import bcrypt from 'bcrypt';
import moment from "moment";
import { UrlToken, UrlTokenEnum } from "../entities/url_token.entity";
import nodemailer from "nodemailer";
import {sendMail} from "../services/mail.service";

const PayloadSchema = Type.Object({
  firstName: Type.String({minLength: 2, maxLength: 50}),
  lastName: Type.String({minLength: 2, maxLength: 50}),
  email: Type.String({format: "email", maxLength: 255}),
  password: Type.String({minLength: 8, maxLength: 255}),
});
type PayloadType = Static<typeof PayloadSchema>;

export const register = (app: FastifyInstance, options: FastifyPluginOptions, done: DoneFuncWithErrOrRes) => {
  app.post<{ Body: PayloadType }>('/register', {
    schema: {body: PayloadSchema},
  }, async (request, reply) => {
    const payload = request.body;

    const emailIsAlreadyExists = await User.count({
      where: {email: payload.email}
    });

    if (emailIsAlreadyExists) {
      return reply.code(422).send({
        message: 'This email is already being used',
      });
    }

    const user = new User;

    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.email = payload.email;
    user.password = await bcrypt.hash(payload.password, bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT_ROUNDS || '12')));
    user.verifiedAt = null;
    user.urlTokens = [];

    await user.save();

    const urlToken = await UrlToken.create({
      type: UrlTokenEnum.EMAIL_VERIFICATION,
      token: UrlToken.generateRandomToken(),
      expireAt: moment().add(1, 'months').toDate(),
      user,
    }).save()

    try {
      await sendMail({
        to: user.email,
        subject: "verify",
        text: "email verification",
        html: '<p>Click <a href="http://localhost:3000/verify?token=\'+${urlToken.token}+\'" >here</a> to verify your email</p>'
      })
    }
    catch(error) {
      console.log(error);
    }

    return reply.code(201).send();
  })

  done();
}
