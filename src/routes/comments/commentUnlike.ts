import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { IsNull } from 'typeorm';
import { Comment } from '../../entities/comment.entity';
import { Like } from '../../entities/like.entity';
// import { CommentLike } from '../../entities/comment_like.entity';

const ParamsSchema = {
  commentId: Type.Number(),
};
type ParamsType = Static<typeof ParamsSchema>;

const commentUnlike = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/comments/:commentId/likes',
    method: 'DELETE',
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

      try {
        const like = await Like.findOneOrFail({
          where: {
            comment,
            post: IsNull(),
            user: request.user,
          },
        });

        await Like.delete(like.id);

        return reply.code(200).send();
      } catch (error) {
        return reply.code(200).send();
      }
    },
  });
};

export default commentUnlike;
