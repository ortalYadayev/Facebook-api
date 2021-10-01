import { preValidationHookHandler } from 'fastify';
import { User } from './entities/user.entity';

declare module 'fastify' {
  interface FastifyInstance {
    authMiddleware: preValidationHookHandler;
  }

  // This doesn't work
  interface FastifyRequest {
    user: User;
  }
}
