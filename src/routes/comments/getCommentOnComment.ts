import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { IsNull } from 'typeorm';
import { Comment } from '../../entities/comment.entity';

const ParamsSchema = {
  commentId: Type.Number(),
  page: Type.Number(),
  skip: Type.Number(),
};
type ParamsType = Static<typeof ParamsSchema>;

const getCommentOnComment = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/comments/:commentId/comments/5/page/:page/skip/:skip',
    method: 'GET',
    preValidation: app.authMiddleware,
    schema: { params: ParamsSchema },
    handler: async (request, reply) => {
      const { commentId, page, skip } = request.params;
      const fromComment = (page - 1) * 5 + skip;

      const data = await Comment.findAndCount({
        where: {
          comment: commentId,
          post: IsNull(),
        },
        relations: ['user', 'likes', 'likes.user'],
        order: {
          id: 'DESC',
        },
        take: 5,
        skip: fromComment,
      });

      const [comments, total] = data;
      const lastPage = Math.ceil((total - skip) / 5);
      const nextPage = page + 1 > lastPage ? null : page + 1;

      if (page > lastPage) {
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

      return reply
        .code(200)
        .send({ comments: newComments, count: total, nextPage });
    },
  });
};
export default getCommentOnComment;
