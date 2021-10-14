import { FastifyInstance } from 'fastify';
import '../preValidationHookHandler';

const me = (app: FastifyInstance): void => {
  app.route({
    url: '/me',
    method: 'POST',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      return reply.code(200).send(request.user);
    },
  });
};

export default me;
