import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { Post } from '../../entities/post.entity';

const PayloadSchema = Type.Object({
  content: Type.String({ minLength: 1, maxLength: 255 }),
});
type PayloadType = Static<typeof PayloadSchema>;

type ParamsType = { username: string };

const storePost = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType; Params: ParamsType }>({
    url: '/posts',
    method: 'POST',
    preValidation: app.authMiddleware,
    schema: { body: PayloadSchema },
    handler: async (request, reply) => {
      const payload = request.body;

      const { user } = request;

      const post = new Post();
      post.content = payload.content;
      post.user = user;

      await post.save();

      return reply.code(201).send(post);
    },
  });
};

export default storePost;
