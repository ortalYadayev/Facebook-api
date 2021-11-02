import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { FriendRequest } from '../../entities/friend_request.entity';
import { User } from '../../entities/user.entity';

const PayloadSchema = Type.Object({
  username: Type.String({ minLength: 1, maxLength: 255 }),
});
type PayloadType = Static<typeof PayloadSchema>;

const storeFriendRequest = (app: FastifyInstance): void => {
  app.route<{ Body: PayloadType }>({
    url: '/friend-requests',
    method: 'POST',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { username } = request.body;
      const { user } = request;

      if (user.username === username) {
        return reply.code(422).send();
      }

      let userByParams: User;
      try {
        userByParams = await User.findOneOrFail({
          where: {
            username,
          },
        });
      } catch (error) {
        return reply.code(404).send({
          message: "The user doesn't exist",
        });
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const friendRequest = await FriendRequest.findOneOrFail({
          where: {
            sender: user,
            receiver: userByParams,
          },
        });

        // if (friendRequest.status === FriendEnum.DELETED) {
        //   friendRequest.status = FriendEnum.PENDING;
        // } else {
        //   friendRequest.status = FriendEnum.DELETED;
        // }
        //
        // await friendRequest.save();

        return reply.code(200).send(friendRequest);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const friendRequest = new FriendRequest();

        friendRequest.sender = user;
        friendRequest.receiver = userByParams;
        // friendRequest.status = FriendEnum.PENDING;

        await friendRequest.save();

        return reply.code(200).send(friendRequest);
      }
    },
  });
};

export default storeFriendRequest;
