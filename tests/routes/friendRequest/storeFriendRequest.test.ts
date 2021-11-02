import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
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

  it('should send a friend request', async () => {
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
        rejectedAt: null,
        approvedAt: null,
        deletedAt: null,
      },
    });

    expect(response.statusCode).toBe(201);
    expect(await FriendRequest.count()).toBe(1);
    expect(friendRequest).not.toBeNull();
    expect(await Friend.count()).toBe(0);
  });

  describe("shouldn't send a friend request", () => {
    it('send himself', async () => {
      const user = await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-request',
        payload: {
          id: user.id,
        },
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(0);
    });

    it('not exist user', async () => {
      const user = await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-request',
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
        url: '/friend-request',
        payload: {
          id: receiver.id,
        },
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(0);
    });

    it('the user sent a request', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();

      await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-request',
        payload: {
          id: receiver.id,
        },
      });

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-request',
        payload: {
          id: receiver.id,
        },
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(1);
    });

    it('a request was sent', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();

      await app.loginAs(receiver).inject({
        method: 'POST',
        url: '/friend-request',
        payload: {
          id: user.id,
        },
      });

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-request',
        payload: {
          id: receiver.id,
        },
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(1);
    });

    it('they are already friends', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      const friendRequest = await FriendRequest.factory().create();
      await Friend.factory()
        .sender(user)
        .receiver(receiver)
        .request(friendRequest)
        .create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/friend-request',
        payload: {
          id: receiver.id,
        },
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(1);
      expect(await Friend.count()).toBe(1);
    });
  });
});
