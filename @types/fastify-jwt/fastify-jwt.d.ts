import { User } from '../../src/entities/user.entity';

declare module 'fastify-jwt' {
  export interface FastifyJWT {
    payload: {
      id: number;
    };
    user: User | undefined;
  }
}
