import { FastifyInstance } from 'fastify';
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
          relations: [
            'receivedFriendRequests',
            'receivedFriendRequests.sender',
            'receivedFriendRequests.receiver',
            'sentFriendRequests',
            'sentFriendRequests.sender',
            'sentFriendRequests.receiver',
          ],
        });
      } catch (error) {
        return reply.code(404).send({
          message: "The user doesn't exist",
        });
      }

      let friendRequests: FriendRequest[] = userByParams.sentFriendRequests;
      friendRequests.push(...userByParams.receivedFriendRequests);

      friendRequests = friendRequests.filter(
        (fr) => fr.sender.id === user.id || fr.receiver.id === user.id,
      );

      let status: string;

      if (friendRequests.length === 0) {
        status = '';
      } else if (friendRequests[friendRequests.length - 1].deletedAt) {
        status = 'deleted';
      } else if (friendRequests[friendRequests.length - 1].approvedAt) {
        status = 'approved';
      } else if (friendRequests[friendRequests.length - 1].rejectedAt) {
        status = 'rejected';
      } else {
        status = 'pending';
      }

      userByParams.receivedFriendRequests = [];
      userByParams.sentFriendRequests = [];

      return reply.code(200).send({ user: userByParams, status });
    },
  });
};

export default getUser;
