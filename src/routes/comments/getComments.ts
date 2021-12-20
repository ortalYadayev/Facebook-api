import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { IsNull } from 'typeorm';
import { Comment } from '../../entities/comment.entity';

const ParamsSchema = {
  postId: Type.Number(),
  page: Type.Number(),
  skip: Type.Number(),
};
type ParamsType = Static<typeof ParamsSchema>;

const getComments = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/posts/:postId/comments/5/page/:page/skip/:skip',
    method: 'GET',
    preValidation: app.authMiddleware,
    schema: { params: ParamsSchema },
    handler: async (request, reply) => {
      const { postId, page, skip } = request.params;
      let fromComment = (page - 1) * 5 + skip;

      if (page < 1) {
        fromComment = skip;
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
        newComments.push({ ...comments[i], commentsCount, comments: [] });
      }

      return reply.code(200).send({ comments: newComments, count: total });
    },
  });
};

export default getComments;
