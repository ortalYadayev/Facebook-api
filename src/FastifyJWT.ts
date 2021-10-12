import { User } from './entities/user.entity';

declare module 'fastify-jwt' {
  export interface FastifyJWT {
    payload: {
      id: number;
    };
    authUser: User | undefined;
  }
}
