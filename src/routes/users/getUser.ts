import { FastifyInstance } from 'fastify';
import { User } from '../../entities/user.entity';

type ParamsType = { username: string };

const getUser = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/users/:username(^[\\w]{2,20}$)',
    method: 'GET',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const user = await User.findOne({
        where: {
          username: request.params.username,
        },
      });

      return reply.code(200).send(user);
    },
  });
};

export default getUser;
