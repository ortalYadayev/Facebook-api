import { FastifyInstance } from 'fastify';
import { Not, IsNull } from 'typeorm';
import { FriendRequest } from '../../entities/friend_request.entity';
import { User } from '../../entities/user.entity';

type ParamsType = { idUser: number };

const storeFriendRequest = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/users/:idUser/friend-requests',
    method: 'POST',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { idUser } = request.params;

      if (request.user.id === parseInt(String(idUser))) {
        return reply.code(422).send();
      }

      let user: User;

      try {
        user = await User.findOneOrFail({
          where: {
            id: idUser,
            verifiedAt: Not(IsNull()),
          },
        });
      } catch (error) {
        return reply.code(404).send({
          message: "The user doesn't exist",
        });
      }

      try {
        await FriendRequest.findOneOrFail({
          where: [
            {
              sender: request.user,
              receiver: user,
              rejectedAt: IsNull(),
              deletedAt: IsNull(),
            },
            {
              sender: user,
              receiver: request.user,
              rejectedAt: IsNull(),
              deletedAt: IsNull(),
            },
          ],
        });

        return reply.code(422).send();
      } catch (error) {
        const friendRequest = new FriendRequest();

        friendRequest.sender = request.user;
        friendRequest.receiver = user;

        await friendRequest.save();
        return reply.code(201).send(friendRequest);
      }
    },
  });
};

export default storeFriendRequest;
