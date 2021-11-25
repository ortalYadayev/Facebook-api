import { FastifyInstance } from 'fastify';
import { Post } from '../../entities/post.entity';

type ParamsType = { id: number };

const getPosts = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/:id/posts',
    method: 'GET',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const posts = await Post.find({
        where: {
          user: request.params.id,
        },
        relations: ['user'],
        order: {
          id: 'DESC',
        },
      });

      return reply.code(200).send(posts);
    },
  });
};

export default getPosts;
