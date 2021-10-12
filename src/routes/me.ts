import { FastifyInstance } from 'fastify';
import '../authMiddleware';
import '../FastifyRequest';

const me = (app: FastifyInstance): void => {
  app.route({
    url: '/me',
    method: 'POST',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { authUser } = request;

      return reply.code(200).send(authUser);
    },
  });
};

export default me;
