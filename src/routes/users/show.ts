import { FastifyInstance } from 'fastify';
import { User } from '../../entities/user.entity';
import { UrlToken } from '../../entities/url_token.entity';
import { Post } from '../../entities/post.entity';

type ParamsType = { username: string };

const show = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/users/:username(^[\\w]{2,20}$)',
    method: 'GET',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      return reply.code(200).send(request.user);
    },
  });
};

declare module 'fastify' {
  interface FastifyRequest {
    user: User | undefined;
  }
}

export default show;
