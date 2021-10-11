import { FastifyInstance } from 'fastify';
import '../authMiddleware';

const me = (app: FastifyInstance): void => {
  app.route({
    url: '/me',
    method: 'POST',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { user } = request;

      return reply.code(200).send(user);
    },
  });
};

export default me;
