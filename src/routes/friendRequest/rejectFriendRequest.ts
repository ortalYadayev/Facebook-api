import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import moment from 'moment';
import { IsNull } from 'typeorm';
import { FriendRequest } from '../../entities/friend_request.entity';

const PayloadSchema = Type.Object({
  id: Type.Number(),
});
type PayloadType = Static<typeof PayloadSchema>;

const rejectFriendRequest = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType }>({
    url: '/friend-requests/reject',
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
