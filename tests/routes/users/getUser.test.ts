import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import { FriendRequest } from '../../../src/entities/friend_request.entity';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { User } from '../../../src/entities/user.entity';

describe('Get user', () => {
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

  describe('should return', () => {
    it('a user and his status "pending"', async () => {
      const user = await User.factory().create();
      const username = 'username';
      const receiver = await User.factory().create({
        username,
      });
      const friendRequest = await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .create();

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/${username}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().user).toMatchObject(receiver.toJSON());
      expect(response.json().statusFriend.status).toEqual('pending');
      expect(response.json().statusFriend.sentBy).toEqual(user.id);
    });

    it('a user and his status "approved"', async () => {
      const user = await User.factory().create();
      const username = 'username';
      const receiver = await User.factory().create({
        username,
      });
      const friendRequest = await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .approved()
        .create();

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/${username}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().user).toMatchObject(receiver.toJSON());
      expect(response.json().statusFriend.status).toEqual('approved');
      expect(response.json().statusFriend.sentBy).toEqual(user.id);
    });

    it('just a user - a friend request deleted', async () => {
      const user = await User.factory().create();
      const username = 'username';
      const receiver = await User.factory().create({
        username,
      });
      await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .deleted()
        .create();

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/${username}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().user).toMatchObject(receiver.toJSON());
    });

    it('just a user - a friend request rejected', async () => {
      const user = await User.factory().create();
      const username = 'username';
      const receiver = await User.factory().create({
        username,
      });
      await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .rejected()
        .create();

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/${username}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().user).toMatchObject(receiver.toJSON());
    });

    it("just a user - doesn't exist a friend request", async () => {
      const user = await User.factory().create();
      const username = 'username';
      const receiver = await User.factory().create({
        username,
      });

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/${username}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().user).toMatchObject(receiver.toJSON());
    });
  });

  describe('should not return a user', () => {
    it('not exists user', async () => {
      const user = await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: '/users/invalid',
      });

      expect(response.statusCode).toBe(404);
    });

    it('not token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/users/username',
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
