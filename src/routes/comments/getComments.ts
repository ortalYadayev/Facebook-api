import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { IsNull } from 'typeorm';
import { Comment } from '../../entities/comment.entity';

const ParamsSchema = {
  postId: Type.Number(),
  page: Type.Number(),
  skip: Type.Number(),
  take: Type.Number(),
};
type ParamsType = Static<typeof ParamsSchema>;

const getComments = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/posts/:postId/comments/:take/page/:page/skip/:skip',
    method: 'GET',
    preValidation: app.authMiddleware,
    schema: { params: ParamsSchema },
    handler: async (request, reply) => {
      const { postId, page, skip, take } = request.params;
      const fromComment = (page - 1) * 5 + skip;

      if (fromComment < 0) {
        return reply.code(200).send();
      }

      const data = await Comment.findAndCount({
        where: {
          post: postId,
          comment: IsNull(),
        },
        relations: ['user', 'likes', 'likes.user'],
        order: {
          id: 'DESC',
        },
        take,
        skip: fromComment,
      });

      const [comments, total] = data;
      const lastPage = Math.ceil((total - skip) / 5);

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
        newComments.push({ ...comments[i], commentsCount });
      }

      reply.code(200).send({ comments: newComments, count: total });
    },
  });
};

export default getComments;
