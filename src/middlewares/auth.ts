import { FastifyInstance } from 'fastify';
import { User } from '../entities/user.entity';

const authMiddleware = (app: FastifyInstance): void => {
  app.decorate('authMiddleware', async (request, reply, done) => {
    try {
      await request.jwtVerify();

      const { id } = request.user;

      if (!id) {
        reply.code(401).send({
          message: 'Unauthorized!',
        });
      }

      request.user = await User.findOne({
        where: { id },
      });

      done();
    } catch (error) {
      reply.code(401).send({
        message: 'Unauthorized!',
      });
    }
  });
};

export default authMiddleware;
