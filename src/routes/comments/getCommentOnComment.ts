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

function paginateResponse(
  data: [Comment[], number],
  page: number,
  limit: number,
  skip: number,
): { comments: Comment[]; nextPage: null | number } | number {
  const [comments, total] = data;
  const first = (page - 1) * limit + skip;
  const lastPage = Math.ceil((total - skip) / limit);
  const nextPage = page + 1 > lastPage ? null : page + 1;

  if (page > lastPage) {
    return 422;
  }

  if (!nextPage) {
    limit = total;
  }

  return {
    comments: [...comments.slice(first, first + limit)],
    nextPage,
  };
}

const getCommentOnComment = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/comments/:commentId/comments/5/page/:page/skip/:skip',
    method: 'GET',
    preValidation: app.authMiddleware,
    schema: { params: ParamsSchema },
    handler: async (request, reply) => {
      const { commentId, page, skip } = request.params;
      const data = await Comment.findAndCount({
        where: {
          comment: commentId,
          post: IsNull(),
        },
        relations: ['user', 'likes', 'likes.user', 'comments'],
        order: {
          id: 'DESC',
        },
      });

      if (data[1] === 0) {
        reply.code(404).send();
      }

      const result = paginateResponse(data, page, 5, skip);

      if (result === 422) {
        reply.code(422).send();
      }

      reply.code(200).send(result);
    },
  });
};
export default getCommentOnComment;
