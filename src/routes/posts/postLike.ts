import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { Post } from '../../entities/post.entity';
import { Like } from '../../entities/like.entity';

const ParamsSchema = { postId: Type.Number() };
type ParamsType = Static<typeof ParamsSchema>;

const postLike = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/posts/:postId/likes',
    method: 'POST',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
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

      try {
        await Like.findOneOrFail({
          where: {
            post,
            user: request.user,
          },
        });

        return reply.code(200).send();
      } catch (error) {
        const like = new Like();

        like.post = post;
        like.user = request.user;

        await like.save();

        return reply.code(201).send();
      }
    },
  });
};

export default postLike;
