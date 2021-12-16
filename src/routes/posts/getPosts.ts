import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { IsNull } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { Comment } from '../../entities/comment.entity';

const ParamsSchema = { userId: Type.Number() };
type ParamsType = Static<typeof ParamsSchema>;

const getPosts = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/users/:userId/posts',
    method: 'GET',
    preValidation: app.authMiddleware,
    schema: { params: ParamsSchema },
    handler: async (request, reply) => {
      const { userId } = request.params;
      const posts = await Post.find({
        where: {
          user: userId,
        },
        relations: ['user', 'likes', 'likes.user'],
        order: {
          id: 'ASC',
        },
      });

      const newPosts = [];
      for (let i = 0; i < posts.length; i++) {
        const commentsCount = await Comment.count({
          where: {
            post: posts[i],
            comment: IsNull(),
          },
        });

        // @ts-ignore
        newPosts.push({ ...posts[i], commentsCount });
      }

      reply.code(200).send(newPosts);
    },
  });
};

export default getPosts;
