import { FastifyInstance } from 'fastify';
import { IsNull, Not } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';

type ParamsType = { postId: number };

const storePost = (app: FastifyInstance): void => {
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

      return reply.code(201).send();
    },
  });
};

export default storePost;
