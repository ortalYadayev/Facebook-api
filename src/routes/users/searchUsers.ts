import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import moment from 'moment';
import { Like, LessThan } from 'typeorm';
import { User } from '../../entities/user.entity';

const PayloadSchema = Type.Object({
  searchQuery: Type.String({ minLength: 1, maxLength: 255 }),
});
type PayloadType = Static<typeof PayloadSchema>;

function isExist(users: User[], userExist): boolean {
  return users.some((user) => user.id === userExist.id);
}

async function find(names: string[]): Promise<User[]> {
  const usersFound: User[] = [];

  for (let index = 0; index < names.length; index++) {
    const users = await User.find({
      where: [
        {
          firstName: Like(`%${names[index]}%`),
          verifiedAt: LessThan(moment().toISOString()),
        },
        {
          lastName: Like(`%${names[index]}%`),
          verifiedAt: LessThan(moment().toISOString()),
        },
      ],
    });

    if (index === 0) {
      usersFound.push(...users);
    } else {
      users.forEach((user) => {
        if (!isExist(usersFound, user)) {
          usersFound.push(user);
        }
      });
    }
  }
  return usersFound;
}

const searchUsers = (app: FastifyInstance): void => {
  app.route<{ Querystring: PayloadType }>({
    url: '/users/search',
    method: 'GET',
    preValidation: app.authMiddleware,
    schema: { querystring: PayloadSchema },
    handler: async (request, reply) => {
      const payload = request.query;

      const me = request.user;

      const names: string[] = payload.searchQuery
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ');

      const users: User[] = await find(names);

      // move me to be first in array
      const index = users.findIndex((user) => user.id === me.id);
      if (index !== -1) {
        users.splice(index, index);
        users.unshift(me);
      }

      return reply.code(200).send(users);
    },
  });
};

export default searchUsers;
