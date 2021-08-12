import {DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions} from "fastify";
import {User} from "../entities/user.entity";
import {Static, Type} from '@sinclair/typebox'
import bcrypt from 'bcrypt';

const PayloadSchema = Type.Object({
  firstName: Type.String({minLength: 2, maxLength: 50}),
  lastName: Type.String({minLength: 2, maxLength: 50}),
  email: Type.String({format: "email"}),
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

    user.password = await bcrypt.hash(payload.password, bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT_ROUNDS)));

    await user.save();

    // @TODO send an email to the user

    return reply.code(201).send();
  })

  done();
}
