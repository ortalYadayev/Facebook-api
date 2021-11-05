import { FastifyInstance } from 'fastify';
import { createConnection, getConnection, IsNull } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { FriendRequest } from '../../../src/entities/friend_request.entity';
import { Friend } from '../../../src/entities/friend.entity';
import { User } from '../../../src/entities/user.entity';

describe('Friend Requests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createFastifyInstance();
  });

  beforeEach(async () => {
    await createConnection();
  });

  afterEach(async () => {
    await getConnection().close();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('should send a friend request', () => {
    it('this is the first request', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-requests',
        payload: {
          id: receiver.id,
        },
      });

      const friendRequest = await FriendRequest.findOne({
        where: {
          sender: user,
          receiver,
          rejectedAt: IsNull(),
          approvedAt: IsNull(),
          deletedAt: IsNull(),
        },
      });

      expect(response.statusCode).toBe(201);
      expect(await FriendRequest.count()).toBe(1);
      expect(friendRequest).not.toBeNull();
      expect(await Friend.count()).toBe(0);
      expect(response.json().statusFriend).toMatchObject({});
    });

    it('a request sent was deleted', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      await FriendRequest.factory()
        .sender(receiver)
        .receiver(user)
        .deleted()
        .create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-requests',
        payload: {
          id: receiver.id,
        },
      });

      expect(response.statusCode).toBe(201);
      expect(await FriendRequest.count()).toBe(2);
      expect(response.json().statusFriend).toMatchObject({});
    });

    it('a request sent was rejected', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      await FriendRequest.factory()
        .sender(receiver)
        .receiver(user)
        .rejected()
        .create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-requests',
        payload: {
          id: receiver.id,
        },
      });

      expect(response.statusCode).toBe(201);
      expect(await FriendRequest.count()).toBe(2);
      expect(response.json().statusFriend).toMatchObject({});
    });
  });

  describe("shouldn't send a friend request", () => {
    it('send himself', async () => {
      const user = await User.factory().create();
      await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-requests',
        payload: {
          id: user.id,
        },
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(0);
    });

    it('not exist a user', async () => {
      const user = await User.factory().create();
      await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-requests',
        payload: {
          id: 10,
        },
      });

      expect(response.statusCode).toBe(404);
      expect(await FriendRequest.count()).toBe(0);
    });

    it('unverified user', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().unverified().create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-requests',
        payload: {
          id: receiver.id,
        },
      });

      expect(response.statusCode).toBe(404);
      expect(await FriendRequest.count()).toBe(0);
    });

    it('the user sent a request', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      await FriendRequest.factory().sender(user).receiver(receiver).create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-requests',
        payload: {
          id: receiver.id,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(await FriendRequest.count()).toBe(1);
      expect(response.json().statusFriend.status).toEqual('pending');
      expect(response.json().statusFriend.sentBy).toEqual(user.id);
    });

    it('a request was sent', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      await FriendRequest.factory().sender(receiver).receiver(user).create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-requests',
        payload: {
          id: receiver.id,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(await FriendRequest.count()).toBe(1);
      expect(response.json().statusFriend.status).toEqual('pending');
      expect(response.json().statusFriend.sentBy).toEqual(receiver.id);
    });

    it('they are already friends', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      const friendRequest = await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .approved()
        .create();
      await Friend.factory()
        .sender(user)
        .receiver(receiver)
        .request(friendRequest)
        .create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-requests',
        payload: {
          id: receiver.id,
        },
      });

      const isApprove = await FriendRequest.findOne({
        where: {
          sender: user,
          receiver,
          rejectedAt: IsNull(),
          approvedAt: IsNull(),
        },
      });

      expect(response.statusCode).toBe(200);
      expect(await FriendRequest.count()).toBe(1);
      expect(await Friend.count()).toBe(1);
      expect(isApprove?.approvedAt).not.toBeNull();
      expect(response.json().statusFriend.status).toEqual('approved');
      expect(response.json().statusFriend.sentBy).toEqual(user.id);
    });
  });
});
