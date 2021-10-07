import { FastifyInstance, preValidationHookHandler } from 'fastify';
import { SignPayloadType } from 'fastify-jwt';
import { User } from '../entities/user.entity';

const authMiddleware = (app: FastifyInstance): void => {
  app.decorate('authMiddleware', async (request, reply, done) => {
    try {
      await request.jwtVerify();

      const { id } = request.user as SignPayloadType;

      request.user = await User.findOneOrFail({
        where: { id },
      });

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

declare module 'fastify-jwt' {
  export interface FastifyJWT {
    payload: {
      id: number;
    };
    user: User | undefined;
  }
}

export default authMiddleware;
