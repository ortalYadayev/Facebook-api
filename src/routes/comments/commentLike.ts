import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { Comment } from '../../entities/comment.entity';
import { CommentLike } from '../../entities/comment_like.entity';

const ParamsSchema = {
  commentId: Type.Number(),
};
type ParamsType = Static<typeof ParamsSchema>;

const commentLike = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/comments/:commentId/likes',
    method: 'POST',
    preValidation: app.authMiddleware,
    schema: { params: ParamsSchema },
    handler: async (request, reply) => {
      let comment: Comment;
      const { commentId } = request.params;

      try {
        comment = await Comment.findOneOrFail({
          where: {
            id: commentId,
          },
        });
      } catch (error) {
        return reply.code(404).send({
          message: "The comment doesn't exist",
        });
      }

      const countOfLikes = await CommentLike.count({
        where: {
          comment,
          user: request.user,
        },
      });

      if (countOfLikes) {
        return reply.code(200).send();
      }

      const like = new CommentLike();

      like.comment = comment;
      like.user = request.user;

      await like.save();

      return reply.code(201).send();
    },
  });
};

export default commentLike;
