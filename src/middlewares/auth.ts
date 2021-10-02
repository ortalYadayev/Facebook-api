import { FastifyInstance, preValidationHookHandler } from 'fastify';
import { User } from '../entities/user.entity';

const authMiddleware = (app: FastifyInstance): void => {
  app.decorate('authMiddleware', async (request, reply, done) => {
    try {
      await request.jwtVerify();

      const { id } = request.user;

      request.user = await User.findOne({
        where: { id },
      });

      if (!request.user) {
        throw new Error();
      }

      done();
    } catch (error) {
      reply.code(401).send({
        message: 'Unauthorized',
      });
    }
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    authMiddleware: preValidationHookHandler;
  }
}

export default authMiddleware;
