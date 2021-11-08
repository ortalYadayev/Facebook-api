import { FastifyInstance } from 'fastify';
import moment from 'moment';
import { IsNull, Not } from 'typeorm';
import { Friend } from '../../entities/friend.entity';
import { FriendRequest } from '../../entities/friend_request.entity';

type ParamsType = { id: number };

const removeFriend = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/friend-requests/:id/remove',
    method: 'DELETE',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { user } = request;
      const { id } = request.params;

      let friendRequest: FriendRequest;
      let friend: Friend;

      try {
        friendRequest = await FriendRequest.findOneOrFail({
          where: [
            {
              sender: id,
              receiver: user,
              rejectedAt: IsNull(),
              deletedAt: IsNull(),
              approvedAt: Not(IsNull()),
            },
            {
              sender: user,
              // receiver: id,
              rejectedAt: IsNull(),
              deletedAt: IsNull(),
              approvedAt: Not(IsNull()),
            },
          ],
          relations: ['sender', 'receiver'],
        });

        friend = await Friend.findOneOrFail({
          where: [
            {
              sender: id,
              receiver: user,
              deletedAt: IsNull(),
              deletedBy: IsNull(),
            },
            {
              sender: user,
              receiver: id,
              deletedAt: IsNull(),
              deletedBy: IsNull(),
            },
          ],
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
