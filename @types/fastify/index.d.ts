import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authMiddleware: preValidationHookHandler;
  }
}
