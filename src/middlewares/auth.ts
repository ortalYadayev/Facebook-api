import { FastifyInstance } from 'fastify';
import '../authMiddleware';
import { SignPayloadType } from 'fastify-jwt';
import { User } from '../entities/user.entity';

const authMiddleware = (app: FastifyInstance): void => {
  app.decorate('authMiddleware', async (request, reply, done) => {
    try {
      await request.jwtVerify();

      const { id } = request.user as SignPayloadType;

      request.authUser = await User.findOneOrFail({
        where: { id },
      });

      delete request.user;

      done();
    } catch (error) {
      reply.code(401).send({
        message: 'Unauthorized',
      });
    }
  });
};

declare module 'fastify-jwt' {
  export interface FastifyJWT {
    payload: {
      id: number;
    };
    user: User | undefined;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    authUser: User | undefined;
  }
}

export default authMiddleware;
