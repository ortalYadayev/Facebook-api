import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import moment from 'moment';
import { IsNull } from 'typeorm';
import { FriendRequest } from '../../entities/friend_request.entity';

const PayloadSchema = Type.Object({
  id: Type.Number(),
});
type PayloadType = Static<typeof PayloadSchema>;

const reject = (app: FastifyInstance): void => {
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
            sender: user,
            receiver: id,
            rejectedAt: IsNull(),
            deletedAt: IsNull(),
            approvedAt: IsNull(),
          },
        });

        friendRequest.rejectedAt = moment().toDate();
        await friendRequest.save();

        return reply.code(201).send({
          statusFriend: {},
        });
      } catch (error) {
        return reply.code(422).send({
          statusFriend: {},
        });
      }
    },
  });
};

export default reject;
