import { FastifyInstance } from 'fastify';
import { User } from '../entities/user.entity';

const authMiddleware = (app: FastifyInstance): void => {
  app.decorate('authMiddleware', (request, reply, done) => {
    request
      .jwtVerify()
      .then(() => {
        const { id } = request.user;

        User.findOneOrFail({
          where: { id },
        })
          .then((response) => {
            request.user = response;
            done();
          })
          .catch(() => {
            reply.code(401).send({
              message: 'Unauthorized',
            });
          });
      })
      .catch(() => {
        reply.code(401).send({
          message: 'Unauthorized',
        });
      });
  });
};

export default authMiddleware;
