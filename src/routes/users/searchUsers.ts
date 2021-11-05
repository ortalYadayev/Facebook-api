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
    order: {
      id: 'ASC',
    },
  });
  return users;
}

function relevantFriendRequests(
  requests: FriendRequest[],
  users: User[],
  me: User,
): [] {
  const result: [] = [];
  users.forEach((user) => {
    let found = false;

    if (user.id === me.id) {
      found = true;

      const userAndFriendRequest = {
        ...user,
        isAuth: true,
        statusFriend: {},
      };
      // @ts-ignore
      result.push(userAndFriendRequest);
    }

    requests.forEach((friendRequest) => {
      if (
        (friendRequest.sender.id === user.id ||
          friendRequest.receiver.id === user.id) &&
        !friendRequest.deletedAt &&
        !friendRequest.rejectedAt &&
        !found
      ) {
        const userAndFriendRequest = {
          ...user,
          statusFriend: {
            status: '',
            sentBy: friendRequest.sender.id,
            receivedBy: friendRequest.receiver.id,
          },
        };
        if (friendRequest.approvedAt) {
          userAndFriendRequest.statusFriend.status = 'approved';
        } else {
          userAndFriendRequest.statusFriend.status = 'pending';
        }
        // @ts-ignore
        result.push(userAndFriendRequest);
        found = true;
      }
    });
    if (!found) {
      const userAndFriendRequest = {
        ...user,
        statusFriend: {},
      };
      // @ts-ignore
      result.push(userAndFriendRequest);
    }
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
        const usersAndStatusFriends = relevantFriendRequests(
          allFriendRequests,
          users,
          me,
        );

        return reply.code(200).send(usersAndStatusFriends);
      } catch (error) {
        return reply.code(422).send();
      }
    },
  });
};

export default searchUsers;
