import { FastifyInstance } from 'fastify';
import { User } from '../../entities/user.entity';
import { Friend, FriendEnum } from '../../entities/friend.entity';

type ParamsType = { username: string };

const friend = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/users/friendrequest/:username',
    method: 'GET',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { username } = request.params;
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
        await Friend.findOneOrFail({
          where: {
            userOne: user,
            userTwo: userByParams,
          },
        });

        return reply.code(422).send();
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const friend = new Friend();

        friend.sender = user;
        friend.receiver = userByParams;
        friend.status = FriendEnum.PENDING;

        await friend.save();

        return reply.code(200).send();
      }
    },
  });
};

export default friend;
