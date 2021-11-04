import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import moment from 'moment';
import { LessThan, Raw } from 'typeorm';
import { FriendRequest } from '../../entities/friend_request.entity';
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

function relevantFriendRequests(
  requests: FriendRequest[],
  users: User[],
): FriendRequest[] {
  const result: FriendRequest[] = [];
  users.filter((user) => {
    const returnFriendRequest = requests.filter(
      (fr) =>
        (fr.sender.id === user.id || fr.receiver.id === user.id) &&
        !fr.deletedAt &&
        !fr.rejectedAt,
    );
    result.push(...returnFriendRequest);
  });
  return result;
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

      const allFriendRequests: FriendRequest[] = me.sentFriendRequests;
      allFriendRequests.push(...me.receivedFriendRequests);

      const searchQuery: string = payload.searchQuery
        .trim()
        .replace(/\s+/g, '* ');

      let users: User[];
      try {
        users = await findUsers(searchQuery);
        users = beFirst(users, me);
        const allRequests = relevantFriendRequests(allFriendRequests, users);

        const r: [{ status: string; sent: number; receiver: number }] = [
          { status: '', sent: 0, receiver: 0 },
        ];

        allRequests.forEach((request1) => {
          if (request1.approvedAt) {
            r.push({
              status: 'approved',
              sent: request1.sender.id,
              receiver: request1.receiver.id,
            });
          } else {
            r.push({
              status: 'pending',
              sent: request1.sender.id,
              receiver: request1.receiver.id,
            });
          }
        });

        return reply.code(200).send({ users, requests: r.splice(1) });
      } catch (error) {
        return reply.code(422).send();
      }
    },
  });
};

export default searchUsers;
