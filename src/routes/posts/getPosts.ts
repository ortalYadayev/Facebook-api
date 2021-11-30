import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { Post } from '../../entities/post.entity';

const ParamsSchema = { userId: Type.Number() };
type ParamsType = Static<typeof ParamsSchema>;

const getPosts = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/users/:userId/posts',
    method: 'GET',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { userId } = request.params;
      const posts = await Post.find({
        where: {
          user: userId,
        },
        relations: ['user', 'likes', 'likes.user'],
        order: {
          id: 'DESC',
        },
      });

      reply.code(200).send(posts);
    },
  });
};

export default getPosts;
