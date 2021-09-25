import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

const PayloadSchema = Type.Object({
  email: Type.String({ format: 'email', maxLength: 255 }),
  password: Type.String({ minLength: 8, maxLength: 255 }),
});
type PayloadType = Static<typeof PayloadSchema>;

const login = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType }>({
    url: '/login',
    method: 'POST',
    schema: { body: PayloadSchema },
    handler: async (request, reply) => {
      const payload = request.body;

      const existingUser = await User.findOne({
        where: { email: payload.email },
      });

      if (
        !existingUser ||
        (existingUser &&
          !(await bcrypt.compare(payload.password, existingUser.password)))
      ) {
        return reply.code(422).send({
          message: 'The email or password are incorrect',
        });
      }

      return reply.code(201).send();
    },
  });
};

export default login;
