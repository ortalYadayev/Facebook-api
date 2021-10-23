import { FastifyInstance } from 'fastify';
import { User } from '../../entities/user.entity';

type ParamsType = { username: string };

const getUser = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/users/:username(^[\\w]{2,20}$)',
    method: 'GET',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { username } = request.params;

      try {
        const userByParams = await User.findOneOrFail({
          where: {
            username,
          },
        });

        return reply.code(200).send(userByParams);
      } catch (error) {
        return reply.code(404).send({
          message: "The user doesn't exist",
        });
      }
    },
  });
};

export default getUser;
