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

      let friendRequest: FriendRequest;

      try {
        friendRequest = await FriendRequest.findOneOrFail({
          where: [
            {
              sender: user.id,
              receiver: userByParams.id,
              rejectedAt: IsNull(),
              deletedAt: IsNull(),
            },
            {
              sender: userByParams.id,
              receiver: user.id,
              rejectedAt: IsNull(),
              deletedAt: IsNull(),
            },
          ],
          relations: ['sender'],
        });
      } catch (error) {
        return reply.code(200).send({
          user: userByParams,
          statusFriend: {},
        });
      }

      let status: string;
      let sentBy: number;

      if (friendRequest.approvedAt) {
        status = 'approved';
        sentBy = friendRequest.sender.id;
      } else {
        status = 'pending';
        sentBy = friendRequest.sender.id;
      }
      return reply
        .code(200)
        .send({ user: userByParams, statusFriend: { status, sentBy } });
    },
  });
};

export default getUser;
