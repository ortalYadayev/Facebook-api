import { FastifyInstance } from 'fastify';

type ParamsType = { username: string };

const getUser = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/users/:username(^[\\w]{2,20}$)',
    method: 'GET',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      return reply.code(200).send(request.user);
    },
  });
};

export default getUser;
