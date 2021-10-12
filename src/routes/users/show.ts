import { FastifyInstance } from 'fastify';
import '../../FastifyRequest';
import '../../getDataByParams';
import '../../authMiddleware';

type ParamsType = { username: string };

const show = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/users/:username(^[\\w]{2,20}$)',
    method: 'GET',
    preValidation: app.authMiddleware,
    preHandler: app.getDataByParams,
    handler: async (request, reply) => {
      return reply.code(200).send(request.user);
    },
  });
};

export default show;
