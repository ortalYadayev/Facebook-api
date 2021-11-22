import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import { FriendRequest } from '../../../src/entities/friend_request.entity';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { User } from '../../../src/entities/user.entity';

describe('Get user', () => {
  let app: FastifyInstance;
  let connection: Connection;

  beforeAll(async () => {
    app = await createFastifyInstance();
  });

  beforeEach(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterEach(async () => {
    await connection.dropDatabase();
    await connection.close();
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
      await FriendRequest.factory().sender(user).receiver(receiver).create();

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/${username}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().user.id).toEqual(receiver.toJSON().id);
      expect(response.json().statusFriend.status).toEqual('pending');
      expect(response.json().statusFriend.sentBy).toEqual(user.id);
    });

    it('a user and his status "approved"', async () => {
      const user = await User.factory().create();
      const username = 'username';
      const receiver = await User.factory().create({
        username,
      });
      await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .approved()
        .create();

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/${username}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().user.id).toEqual(receiver.toJSON().id);
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
      expect(response.json().user.id).toEqual(receiver.toJSON().id);
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
      expect(response.json().user.id).toEqual(receiver.toJSON().id);
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
      expect(response.json().user.id).toEqual(receiver.toJSON().id);
    });

    it("just a user doesn't exist a profile image", async () => {
      const user = await User.factory().create();
      const username = 'username';
      const picture = 'ortal.png';
      const receiver = await User.factory().profilePicture(picture).create({
        username,
      });

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/${username}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().user.id).toEqual(receiver.toJSON().id);
      expect(response.json().user.profilePictureUrl).toEqual(
        `${process.env.APP_URL}/${picture}`,
      );
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
