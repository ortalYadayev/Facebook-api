import { FastifyInstance } from 'fastify';
import moment from 'moment';
import { IsNull } from 'typeorm';
import { Static, Type } from '@sinclair/typebox';
import { FriendRequest } from '../../entities/friend_request.entity';

const ParamsSchema = { friendRequestId: Type.Number() };
type ParamsType = Static<typeof ParamsSchema>;

const deleteFriendRequest = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/friend-requests/:friendRequestId',
    method: 'DELETE',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { friendRequestId } = request.params;
      try {
        const friendRequest = await FriendRequest.findOneOrFail({
          where: {
            id: friendRequestId,
            sender: request.user,
            rejectedAt: IsNull(),
            deletedAt: IsNull(),
            approvedAt: IsNull(),
          },
        });

        friendRequest.deletedAt = moment().toDate();
        await friendRequest.save();

        return reply.code(200).send();
      } catch (error) {
        return reply.code(422).send();
      }
    },
  });
};

export default deleteFriendRequest;
