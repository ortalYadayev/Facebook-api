import { FastifyInstance } from 'fastify';
import { IsNull } from 'typeorm';
import { Friend } from '../../entities/friend.entity';
import { FriendRequest } from '../../entities/friend_request.entity';

type ParamsType = { idRequest: number };

const approveFriendRequest = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/friend-requests/:idRequest/approve',
    method: 'POST',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { idRequest } = request.params;

      try {
        const friendRequest = await FriendRequest.findOneOrFail({
          where: {
            id: idRequest,
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
        await friendRequest.save();

        return reply.code(200).send();
      } catch (error) {
        return reply.code(422).send();
      }
    },
  });
};

export default approveFriendRequest;
