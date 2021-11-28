import { FastifyInstance } from 'fastify';
import { Post } from '../../entities/post.entity';
import { Like } from '../../entities/like.entity';

type ParamsType = { postId: number };

const postUnlike = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/posts/:postId/unlike',
    method: 'DELETE',
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
        const like = await Like.findOneOrFail({
          where: {
            post,
            user: request.user,
          },
        });

        await Like.delete(like.id);

        return reply.code(200).send();
      } catch (error) {
        return reply.code(422).send();
      }
    },
  });
};

export default postUnlike;
