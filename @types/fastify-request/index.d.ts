import { User } from '../../src/entities/user.entity';

declare module 'fastify' {
  interface FastifyRequest {
    user: User;
  }
}
