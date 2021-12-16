import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { IsNull } from 'typeorm';
import { Comment } from '../../entities/comment.entity';

const ParamsSchema = {
  postId: Type.Number(),
};
type ParamsType = Static<typeof ParamsSchema>;

const getLastComment = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/posts/:postId/comments/1',
    method: 'GET',
    preValidation: app.authMiddleware,
    schema: { params: ParamsSchema },
    handler: async (request, reply) => {
      const { postId } = request.params;

      const comment = await Comment.find({
        where: {
          post: postId,
          comment: IsNull(),
        },
        relations: ['user', 'likes', 'likes.user'],
        order: {
          id: 'DESC',
        },
        take: 1,
      });

      if (comment.length !== 1) {
        reply.code(422).send();
      }

      const commentsCount = await Comment.count({
        where: {
          comment: comment[0],
          post: IsNull(),
        },
      });

      reply.code(200).send({ ...comment[0], commentsCount });
    },
  });
};
export default getLastComment;
