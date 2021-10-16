import { FastifyInstance, FastifyRequest } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { StorePost } from '../../entities/storePost.entity';
import { User } from '../../entities/user.entity';

const PayloadSchema = Type.Object({
  content: Type.String({ minLength: 1, maxLength: 255 }),
});
type PayloadType = Static<typeof PayloadSchema>;

type ParamsType = { username: string };

const storePost = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType; Params: ParamsType }>({
    url: '/users/:username(^[\\w]{2,20}$)/posts',
    method: 'POST',
    preValidation: app.authMiddleware,
    schema: { body: PayloadSchema },
    handler: async (request, reply) => {
      const payload = request.body;

      const { user } = request;

      let toUser: User;

      try {
        toUser = await User.findOneOrFail({
          where: {
            username: request.params.username,
          },
        });
      } catch (error) {
        return reply.code(404).send("User doesn't exists");
      }

      const post = new StorePost();
      post.content = payload.content;
      post.createdBy = user;
      post.user = toUser;

      await post.save();

      return reply.code(201).send(post);
    },
  });
};

export default storePost;
