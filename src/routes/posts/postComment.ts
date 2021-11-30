import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { Post } from '../../entities/post.entity';
import { Comment } from '../../entities/comment.entity';

const ParamsSchema = { postId: Type.Number() };
type ParamsType = Static<typeof ParamsSchema>;

const PayloadSchema = Type.Object({
  content: Type.String({ minLength: 1, maxLength: 255 }),
});
type PayloadType = Static<typeof PayloadSchema>;

const postComment = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType; Params: ParamsType }>({
    url: '/posts/:postId/comments',
    method: 'POST',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const payload = request.body;

      let post: Post;
      const { postId } = request.params;
      try {
        post = await Post.findOneOrFail({
          where: {
            id: postId,
          },
          relations: ['likes'],
        });
      } catch (error) {
        return reply.code(404).send({
          message: "The post doesn't exist",
        });
      }

      const comment = new Comment();

      comment.post = post;
      comment.user = request.user;
      comment.content = payload.content;

      await comment.save();

      return reply.code(201).send();
    },
  });
};

export default postComment;
