import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { Post } from '../../entities/post.entity';
import '../../authMiddleware';
import '../../getDataByParams';
import '../../FastifyRequest';

const PayloadSchema = Type.Object({
  description: Type.String({ minLength: 1, maxLength: 255 }),
});
type PayloadType = Static<typeof PayloadSchema>;

type ParamsType = { username: string };

const storePost = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType; Params: ParamsType }>({
    url: '/users/:username(^[\\w]{2,20}$)/posts',
    method: 'POST',
    preValidation: app.authMiddleware,
    preHandler: app.getDataByParams,
    schema: { body: PayloadSchema },
    handler: async (request, reply) => {
      const payload = request.body;
      const { authUser, user } = request;

      const post = new Post();
      post.description = payload.description;
      post.createdBy = authUser;
      post.user = user;

      await post.save();

      return reply.code(201).send(post);
    },
  });
};

export default storePost;
