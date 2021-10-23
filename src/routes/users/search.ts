import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { User } from '../../entities/user.entity';

const PayloadSchema = Type.Object({
  body: Type.String({ minLength: 1, maxLength: 255 }),
});
type PayloadType = Static<typeof PayloadSchema>;

const getUser = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType }>({
    url: '/search',
    method: 'POST',
    preValidation: app.authMiddleware,
    schema: { body: PayloadSchema },
    handler: async (request, reply) => {
      const payload = request.body;
      const names: string[] = payload.body.split(' ');

      let users: User[];
      try {
        users = await User.find();
      } catch (error) {
        return reply.code(422).send({ message: "There aren't users" });
      }

      const usersFound = users.filter((user) => {
        const namesFound = names.filter(
          (name) =>
            user.firstName.includes(name) || user.lastName.includes(name),
        );

        return namesFound.length;
      });

      if (usersFound.length) {
        return reply.code(200).send(usersFound);
      }

      return reply.code(422).send({
        message: "We didn't find any results.",
      });
    },
  });
};

export default getUser;
