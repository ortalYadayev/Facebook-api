import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { User } from '../../entities/user.entity';

const PayloadSchema = Type.Object({
  query: Type.String({ minLength: 1, maxLength: 255 }),
});
type PayloadType = Static<typeof PayloadSchema>;

const getUser = (app: FastifyInstance): void => {
  app.route<{ Querystring: PayloadType }>({
    url: '/search',
    method: 'GET',
    preValidation: app.authMiddleware,
    schema: { querystring: PayloadSchema },
    handler: async (request, reply) => {
      const payload = request.query;
      const names: string[] = payload.query.split(' ');

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

      return reply.code(200).send();
    },
  });
};

export default getUser;
