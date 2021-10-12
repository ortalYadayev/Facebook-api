import { FastifyInstance } from 'fastify';
import '../authMiddleware';
import { User } from '../entities/user.entity';

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

declare module 'fastify' {
  interface FastifyRequest {
    authUser: User | undefined;
  }
}

export default me;
