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
    const userAndFriendRequest = {
      ...user,
      isAuth: false,
      statusFriend: {},
    };

    if (user.id === me.id) {
      userAndFriendRequest.isAuth = true;
    } else {
      requests.forEach((friendRequest) => {
        if (
          (friendRequest.sender.id === user.id ||
            friendRequest.receiver.id === user.id) &&
          !friendRequest.deletedAt &&
          !friendRequest.rejectedAt
        ) {
          const statusFriend = {
            status: '',
            requestId: friendRequest.id,
            sentBy: friendRequest.sender.id,
          };

          if (friendRequest.approvedAt) {
            statusFriend.status = 'approved';
          } else {
            statusFriend.status = 'pending';
          }
          userAndFriendRequest.statusFriend = statusFriend;
        }
      });
    }
    // @ts-ignore
    result.push(userAndFriendRequest);
  });

  return result;
}

function unshiftUser(users: User[], me: User): User[] {
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
      const { user } = request;

      const allFriendRequests: FriendRequest[] = user.sentFriendRequests;
      allFriendRequests.push(...user.receivedFriendRequests);

      const searchQuery: string = payload.searchQuery
        .trim()
        .replace(/\s+/g, '* ');

      let users: User[];

      users = await findUsers(searchQuery);
      users = unshiftUser(users, user);
      const usersAndStatusFriends = relevantFriendRequests(
        allFriendRequests,
        users,
        user,
      );

      return reply.code(200).send(usersAndStatusFriends);
    },
  });
};

export default searchUsers;
