import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { IsNull } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { Comment } from '../../entities/comment.entity';

const ParamsSchema = { userId: Type.Number() };
type ParamsType = Static<typeof ParamsSchema>;

const PayloadSchema = Type.Object({
  page: Type.Number(),
  skip: Type.Number(),
});
type PayloadType = Static<typeof PayloadSchema>;

const getPosts = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType; Params: ParamsType }>({
    url: '/users/:userId/posts',
    method: 'POST',
    preValidation: app.authMiddleware,
    schema: { body: PayloadSchema, params: ParamsSchema },
    handler: async (request, reply) => {
      const { userId } = request.params;
      const payload = request.body;
      const fromComment = (payload.page - 1) * 5 + payload.skip;

      const [posts, total] = await Post.findAndCount({
        where: {
          user: userId,
        },
        relations: ['user', 'likes', 'likes.user'],
        order: {
          id: 'DESC',
        },
        take: 10,
        skip: fromComment,
      });

      Math.ceil((total - payload.skip) / 10);

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

      return reply.code(200).send(newPosts);
    },
  });
};

export default getPosts;
