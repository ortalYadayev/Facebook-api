import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import moment from 'moment';
import { IsNull } from 'typeorm';
import { Friend } from '../../entities/friend.entity';
import { FriendRequest } from '../../entities/friend_request.entity';

const PayloadSchema = Type.Object({
  id: Type.Number(),
});
type PayloadType = Static<typeof PayloadSchema>;

const approve = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType }>({
    url: '/friend-requests/remove',
    method: 'POST',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { id } = request.body;
      const { user } = request;

      let friendRequest: FriendRequest;
      try {
        friendRequest = await FriendRequest.findOneOrFail({
          where: [
            {
              sender: id,
              receiver: user,
              rejectedAt: IsNull(),
              deletedAt: IsNull(),
            },
            {
              sender: user,
              receiver: id,
              rejectedAt: IsNull(),
              deletedAt: IsNull(),
            },
          ],
          relations: ['sender', 'receiver'],
        });

        if (!friendRequest.approvedAt) {
          return reply.code(422).send({
            message: "You can't remove friendship",
            statusFriend: {
              status: 'pending',
              sentBy: friendRequest.sender.id,
            },
          });
        }
      } catch (error) {
        return reply.code(422).send({
          message: "You didn't remove a friendship",
          statusFriend: {},
        });
      }

      let friend: Friend;
      try {
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
        return reply.code(422).send({
          message: "You're not friends",
          statusFriend: {},
        });
      }

      const dateToRemove = moment().toDate();

      friend.deletedAt = dateToRemove;
      friend.deletedBy = user;
      await friend.save();

      friendRequest.deletedAt = dateToRemove;
      friendRequest.friend = friend;
      await friendRequest.save();

      return reply.code(201).send({
        statusFriend: {},
      });
    },
  });
};

export default approve;
