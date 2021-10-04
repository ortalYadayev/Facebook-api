import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import moment from 'moment';
import { User } from '../entities/user.entity';
import { UrlToken, UrlTokenEnum } from '../entities/url_token.entity';
import { sendMail } from '../services/mail.service';

const PayloadSchema = Type.Object({
  firstName: Type.String({ minLength: 2, maxLength: 50 }),
  lastName: Type.String({ minLength: 2, maxLength: 50 }),
  email: Type.String({ format: 'email', maxLength: 255 }),
  password: Type.String({ minLength: 8, maxLength: 255 }),
});

type PayloadType = Static<typeof PayloadSchema>;

async function sendEmailVerification(user: User) {
  await UrlToken.update(
    {
      user,
    },

    {
      expireAt: moment().toDate(),
    },
  );

  const urlToken = await UrlToken.create({
    type: UrlTokenEnum.EMAIL_VERIFICATION,
    token: UrlToken.generateRandomToken(),
    expireAt: moment().add(1, 'months').toDate(),
    user,
  }).save();

  await sendMail({
    to: user.email,
    subject: 'verify',
    text: 'email verification',
    html: `<p>Click <a href="${process.env.USER_APP_URL}/verify?token=${urlToken.token}">here</a> to verify your email</p>`,
  });
}

const register = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType }>({
    url: '/register',
    method: 'POST',
    schema: { body: PayloadSchema },
    handler: async (request, reply) => {
      const payload = request.body;

      const existingUser = await User.findOne({
        where: { email: payload.email },
      });
      if (existingUser) {
        return reply.code(422).send({
          message:
            'This email is already being used, resend verify click here.',
          type: 'email',
        });
      }

      const user = new User();
      user.firstName = payload.firstName;
      user.lastName = payload.lastName;
      user.email = payload.email;
      user.password = User.hashPassword(payload.password);
      user.verifiedAt = null;

      user.urlTokens = [];

      await user.save();
      await sendEmailVerification(user);
      return reply.code(201).send();
    },
  });
};

export default register;
