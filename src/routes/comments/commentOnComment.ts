import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { Comment } from '../../entities/comment.entity';
import { CommentOnComment } from '../../entities/comment_on_comment.entity';

const PayloadSchema = Type.Object({
  content: Type.String({ minLength: 1, maxLength: 255 }),
});
type PayloadType = Static<typeof PayloadSchema>;

const ParamsSchema = { commentId: Type.Number() };
type ParamsType = Static<typeof ParamsSchema>;

const commentOnComment = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType; Params: ParamsType }>({
    url: '/comments/:commentId/comments',
    method: 'POST',
    preValidation: app.authMiddleware,
    schema: { body: PayloadSchema, params: ParamsSchema },
    handler: async (request, reply) => {
      const payload = request.body;
      const { commentId } = request.params;
      let comment: Comment;

      try {
        comment = await Comment.findOneOrFail({
          where: {
            id: commentId,
          },
        });
      } catch (error) {
        return reply.code(404).send();
      }

      const commentOn = new CommentOnComment();

      commentOn.comment = comment;
      commentOn.user = request.user;
      commentOn.content = payload.content;

      await commentOn.save();

      return reply.code(201).send(commentOn);
    },
  });
};
export default commentOnComment;
