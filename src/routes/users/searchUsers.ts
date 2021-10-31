import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import moment from 'moment';
import { LessThan, Raw } from 'typeorm';
import { User } from '../../entities/user.entity';

const PayloadSchema = Type.Object({
  searchQuery: Type.String({ minLength: 1, maxLength: 255 }),
});
type PayloadType = Static<typeof PayloadSchema>;

async function findUsers(searchQuery: string): Promise<User[]> {
  const users = User.find({
    where: {
      firstName: Raw(
        () =>
          `MATCH(firstName, lastName) AGAINST (:searchQuery IN BOOLEAN MODE)`,
        { searchQuery: `${searchQuery}*` },
      ),
      verifiedAt: LessThan(moment().format()),
    },
  });
  return users;
}

function beFirst(users: User[], me: User): User[] {
  const index = users.findIndex((user) => user.id === me.id);

  if (index !== -1 && index !== 0) {
    users.splice(index, index);
    users.unshift(me);
  }

  return users;
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

      const searchQuery: string = payload.searchQuery
        .trim()
        .replace(/\s+/g, '* ');

      let users: User[];
      try {
        users = await findUsers(searchQuery);
        users = beFirst(users, me);

        return reply.code(200).send(users);
      } catch (error) {
        console.log(error);
        return reply.code(422).send();
      }
    },
  });
};

export default searchUsers;
