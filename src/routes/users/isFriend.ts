import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { User } from '../../entities/user.entity';
import { Friend } from '../../entities/friend.entity';

const PayloadSchema = Type.Object({
  username: Type.String({ minLength: 1, maxLength: 255 }),
});
type PayloadType = Static<typeof PayloadSchema>;

const isFriend = (app: FastifyInstance): void => {
  app.route<{ Querystring: PayloadType }>({
    url: '/users/friends',
    method: 'GET',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { username } = request.query;
      const { user } = request;

      let userByParams: User;
      try {
        userByParams = await User.findOneOrFail({
          where: {
            username,
          },
        });
      } catch (error) {
        return reply.code(404).send({
          message: "The user doesn't exist",
        });
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const friendRequest = await Friend.findOneOrFail({
          where: {
            sender: user,
            receiver: userByParams,
          },
        });

        return reply.code(200).send(friendRequest);
      } catch (error) {
        return reply.code(422).send({
          message: "There isn't a friend request",
        });
      }
    },
  });
};

export default isFriend;
