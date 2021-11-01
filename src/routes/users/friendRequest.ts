import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { User } from '../../entities/user.entity';
import { Friend, FriendEnum } from '../../entities/friend.entity';

const PayloadSchema = Type.Object({
  username: Type.String({ minLength: 1, maxLength: 255 }),
});
type PayloadType = Static<typeof PayloadSchema>;

const friendRequest = (app: FastifyInstance): void => {
  app.route<{ Querystring: PayloadType }>({
    url: '/users/friendrequest',
    method: 'GET',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { username } = request.query;
      const { user } = request;

      if (user.username === username) {
        return reply.code(422).send();
      }

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

        if (friendRequest.status === FriendEnum.DELETED) {
          friendRequest.status = FriendEnum.PENDING;
        } else {
          friendRequest.status = FriendEnum.DELETED;
        }

        await friendRequest.save();

        return reply.code(200).send();
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const friendRequest = new Friend();

        friendRequest.sender = user;
        friendRequest.receiver = userByParams;
        friendRequest.status = FriendEnum.PENDING;

        await friendRequest.save();

        return reply.code(200).send();
      }
    },
  });
};

export default friendRequest;
