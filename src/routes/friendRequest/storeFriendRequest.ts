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
          relations: [
            'receivedFriendRequests',
            'receivedFriendRequests.sender',
            'receivedFriendRequests.receiver',
            'sentFriendRequests',
            'sentFriendRequests.sender',
            'sentFriendRequests.receiver',
          ],
        });
      } catch (error) {
        return reply.code(404).send({
          message: "The user doesn't exist",
        });
      }

      let friendRequests: FriendRequest[] = receiver.sentFriendRequests;
      friendRequests.push(...receiver.receivedFriendRequests);

      friendRequests = friendRequests.filter(
        (fr) =>
          (fr.sender.id === user.id || fr.receiver.id === user.id) &&
          !fr.rejectedAt &&
          !fr.deletedAt,
      );
      console.log(friendRequests);
      if (friendRequests.length === 0 && !friendRequests[0].approvedAt) {
        const friendRequest = new FriendRequest();

        friendRequest.sender = user;
        friendRequest.receiver = receiver;

        await friendRequest.save();
        return reply.code(201).send(friendRequest);
      }
      return reply
        .code(422)
        .send({ message: 'You sent or received a friend request' });
    },
  });
};

export default storeFriendRequest;
