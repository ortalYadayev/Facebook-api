import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { Not, IsNull } from 'typeorm';
import { FriendRequest } from '../../entities/friend_request.entity';
import { User } from '../../entities/user.entity';

const PayloadSchema = Type.Object({
  id: Type.Number(),
});
type PayloadType = Static<typeof PayloadSchema>;

const storeFriendRequest = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType }>({
    url: '/friend-requests',
    method: 'POST',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { id } = request.body;
      const { user } = request;

      if (user.id === id) {
        return reply.code(422).send();
      }

      let receiver: User;

      try {
        receiver = await User.findOneOrFail({
          where: {
            id,
            verifiedAt: Not(IsNull()),
          },
        });
      } catch (error) {
        return reply.code(404).send({
          message: "The user doesn't exist",
        });
      }

      try {
        const friendRequest = await FriendRequest.findOneOrFail({
          where: [
            {
              sender: user.id,
              receiver: id,
              rejectedAt: IsNull(),
              deletedAt: IsNull(),
            },
            {
              sender: id,
              receiver: user.id,
              rejectedAt: IsNull(),
              deletedAt: IsNull(),
            },
          ],
          relations: ['sender'],
        });

        if (friendRequest.approvedAt) {
          return reply.code(200).send({
            statusFriend: {
              status: 'approved',
              sentBy: friendRequest.sender.id,
            },
          });
        }

        return reply.code(200).send({
          statusFriend: {
            status: 'pending',
            sentBy: friendRequest.sender.id,
          },
        });
      } catch (error) {
        const friendRequest = new FriendRequest();

        friendRequest.sender = user;
        friendRequest.receiver = receiver;

        await friendRequest.save();
        return reply.code(201).send({
          statusFriend: {
            status: 'pending',
            sentBy: friendRequest.sender.id,
          },
        });
      }
    },
  });
};

export default storeFriendRequest;
