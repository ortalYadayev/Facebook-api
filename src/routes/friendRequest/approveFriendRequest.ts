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

const approveFriendRequest = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType }>({
    url: '/friend-requests/approve',
    method: 'POST',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { id } = request.body;
      const { user } = request;

      try {
        const friendRequest = await FriendRequest.findOneOrFail({
          where: {
            sender: id,
            receiver: user,
            rejectedAt: IsNull(),
            deletedAt: IsNull(),
            approvedAt: IsNull(),
          },
          relations: ['sender', 'receiver'],
        });

        const friend = new Friend();
        friend.sender = friendRequest.sender;
        friend.receiver = friendRequest.receiver;
        friend.request = friendRequest;
        await friend.save();

        friendRequest.approvedAt = friend.createdAt;
        friendRequest.friend = friend;
        await friendRequest.save();

        return reply.code(200).send();
      } catch (error) {
        return reply.code(422).send();
      }
    },
  });
};

export default approveFriendRequest;
