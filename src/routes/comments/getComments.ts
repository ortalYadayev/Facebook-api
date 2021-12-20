import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { IsNull } from 'typeorm';
import { Comment } from '../../entities/comment.entity';

const ParamsSchema = {
  postId: Type.Number(),
};
type ParamsType = Static<typeof ParamsSchema>;

const PayloadSchema = Type.Object({
  page: Type.Number(),
  skip: Type.Number(),
});
type PayloadType = Static<typeof PayloadSchema>;

const getComments = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType; Params: ParamsType }>({
    url: '/posts/:postId/comments/5',
    method: 'POST',
    preValidation: app.authMiddleware,
    schema: { body: PayloadSchema, params: ParamsSchema },
    handler: async (request, reply) => {
      const { postId } = request.params;
      const payload = request.body;

      let fromComment = (payload.page - 1) * 5 + payload.skip;

      if (payload.page < 1) {
        fromComment = payload.skip;
      }

      const [comments, total] = await Comment.findAndCount({
        where: {
          post: postId,
          comment: IsNull(),
        },
        relations: ['user', 'likes', 'likes.user'],
        order: {
          id: 'DESC',
        },
        take: 5,
        skip: fromComment,
      });
      const lastPage = Math.ceil((total - payload.skip) / 5);

      if (payload.page > lastPage) {
        return reply.code(200).send();
      }

      const newComments = [];
      for (let i = 0; i < comments.length; i++) {
        const commentsCount = await Comment.count({
          where: {
            comment: comments[i],
            post: IsNull(),
          },
        });

        // @ts-ignore
        newComments.push({ ...comments[i], commentsCount, comments: [] });
      }

      return reply.code(200).send({ comments: newComments, count: total });
    },
  });
};

export default getComments;
