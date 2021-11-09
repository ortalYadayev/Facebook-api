import { FastifyInstance } from 'fastify';
import { IsNull } from 'typeorm';
import { FriendRequest } from '../../entities/friend_request.entity';
import { User } from '../../entities/user.entity';

type ParamsType = { username: string };

const getUser = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/users/:username',
    method: 'GET',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { username } = request.params;

      let user: User;
      try {
        user = await User.findOneOrFail({
          where: {
            username,
          },
        });
      } catch (error) {
        return reply.code(404).send({
          message: "The user doesn't exist",
        });
      }

      let friendRequest: FriendRequest;

      try {
        friendRequest = await FriendRequest.findOneOrFail({
          where: [
            {
              sender: request.user.id,
              receiver: user.id,
              rejectedAt: IsNull(),
              deletedAt: IsNull(),
            },
            {
              sender: user.id,
              receiver: request.user.id,
              rejectedAt: IsNull(),
              deletedAt: IsNull(),
            },
          ],
          relations: ['sender'],
        });
      } catch (error) {
        return reply.code(200).send({
          user,
        });
      }

      const status: string = friendRequest.approvedAt ? 'approved' : 'pending';
      const sentBy: number = friendRequest.sender.id;

      return reply
        .code(200)
        .send({ user, friendRequest, statusFriend: { status, sentBy } });
    },
  });
};

export default getUser;
