import { FastifyInstance } from 'fastify';
import moment from 'moment';
import { IsNull, Not } from 'typeorm';
import { Friend } from '../../entities/friend.entity';
import { FriendRequest } from '../../entities/friend_request.entity';

type ParamsType = { idRequest: number };

const removeFriend = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/friend-requests/:idRequest/remove',
    method: 'DELETE',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { user } = request;
      const { idRequest } = request.params;

      let friendRequest: FriendRequest;
      let friend: Friend;

      try {
        friendRequest = await FriendRequest.findOneOrFail({
          where: {
            id: idRequest,
            rejectedAt: IsNull(),
            deletedAt: IsNull(),
            approvedAt: Not(IsNull()),
          },
          relations: ['sender', 'receiver', 'friend'],
        });

        friend = await Friend.findOneOrFail({
          where: {
            id: friendRequest.friend?.id,
            deletedAt: IsNull(),
            deletedBy: IsNull(),
          },
        });
      } catch (error) {
        return reply.code(422).send();
      }

      const dateToRemove = moment().toDate();

      friend.deletedAt = dateToRemove;
      friend.deletedBy = user;
      await friend.save();

      friendRequest.deletedAt = dateToRemove;
      friendRequest.friend = friend;
      await friendRequest.save();

      return reply.code(200).send();
    },
  });
};

export default removeFriend;
