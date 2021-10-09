import { FastifyInstance } from 'fastify';
import { User } from '../../entities/user.entity';

type ParamsType = { username: string };

const show = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/users/:username(^[\\w]{2,20}$)',
    method: 'GET',
    handler: async (request, reply) => {
      const { username } = request.params;

      try {
        const user = await User.findOneOrFail({
          where: {
            username,
          },
        });

        return reply.code(200).send(user);
      } catch {
        return reply.code(404).send();
      }
    },
  });
};

export default show;
