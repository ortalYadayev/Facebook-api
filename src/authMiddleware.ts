import { preValidationHookHandler } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authMiddleware: preValidationHookHandler;
  }
}
