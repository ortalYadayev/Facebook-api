import { FastifyInstance } from 'fastify';
import moment from 'moment';
import { IsNull } from 'typeorm';
import { FriendRequest } from '../../entities/friend_request.entity';

type ParamsType = { id: number };

const rejectFriendRequest = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/friend-requests/:id/reject',
    method: 'DELETE',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { id } = request.params;

      try {
        const friendRequest = await FriendRequest.findOneOrFail({
          where: {
            id,
            receiver: request.user,
            rejectedAt: IsNull(),
            deletedAt: IsNull(),
            approvedAt: IsNull(),
          },
        });

        friendRequest.rejectedAt = moment().toDate();
        await friendRequest.save();

        return reply.code(200).send();
      } catch (error) {
        return reply.code(422).send();
      }
    },
  });
};

export default rejectFriendRequest;
