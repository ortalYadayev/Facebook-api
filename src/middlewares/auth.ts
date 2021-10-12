import { FastifyInstance } from 'fastify';
import { SignPayloadType } from 'fastify-jwt';
import { User } from '../entities/user.entity';
import '../FastifyRequest';
import '../FastifyJWT';

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

export default authMiddleware;
