import { User } from '../../src/entities/user.entity';

declare module 'fastify-jwt' {
  interface FastifyJWT {
    user: User;
  }
}
