import { FastifyInstance } from 'fastify';
import { Post } from '../../entities/post.entity';
import { Like } from '../../entities/like.entity';

type ParamsType = { postId: number };

const postLike = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/posts/:postId/like',
    method: 'POST',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      let post: Post;
      try {
        post = await Post.findOneOrFail({
          where: {
            id: request.params.postId,
          },
          relations: ['likes'],
        });
      } catch (error) {
        return reply.code(422).send({
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

        return reply.code(422).send({
          message: 'You already liked',
        });
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
