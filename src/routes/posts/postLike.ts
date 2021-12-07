import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { Post } from '../../entities/post.entity';
import { PostLike } from '../../entities/post_like.entity';

const ParamsSchema = { postId: Type.Number() };
type ParamsType = Static<typeof ParamsSchema>;

const postLike = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/posts/:postId/likes',
    method: 'POST',
    preValidation: app.authMiddleware,
    schema: { params: ParamsSchema },
    handler: async (request, reply) => {
      let post: Post;
      const { postId } = request.params;

      try {
        post = await Post.findOneOrFail({
          where: {
            id: postId,
          },
        });
      } catch (error) {
        return reply.code(404).send({
          message: "The post doesn't exist",
        });
      }

      const countOfLikes = await PostLike.count({
        where: {
          post,
          user: request.user,
        },
      });

      if (countOfLikes) {
        return reply.code(200).send();
      }

      const like = new PostLike();

      like.post = post;
      like.user = request.user;

      await like.save();

      return reply.code(201).send();
    },
  });
};

export default postLike;
