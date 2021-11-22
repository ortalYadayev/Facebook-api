import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { User } from '../../../src/entities/user.entity';
import { FriendRequest } from '../../../src/entities/friend_request.entity';

describe('Search Users', () => {
  let app: FastifyInstance;
  let connection: Connection;

  beforeAll(async () => {
    app = await createFastifyInstance();
  });

  beforeEach(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    console.log(connection);
  });

  afterEach(async () => {
    console.log(connection);
    await connection.dropDatabase();
    await connection.close();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('should return matching users', () => {
    it('by first name - the user who logged in, be first in the array', async () => {
      const firstName = 'name';
      await User.factory().create({ firstName });
      const user = await User.factory().create({ firstName });

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: '/users/search',
        query: {
          searchQuery: `${firstName}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(
        expect.arrayContaining([expect.objectContaining({ firstName })]),
      );
      expect(response.json()[0].id).toEqual(user.toJSON().id);
    });

    it('by last name and their friend request', async () => {
      const user = await User.factory().create();
      const lastName = 'name';
      const receiver1 = await User.factory().create({ lastName });
      const receiver2 = await User.factory().create({ lastName });
      await FriendRequest.factory().sender(receiver1).receiver(user).create();
      await FriendRequest.factory()
        .sender(receiver2)
        .receiver(user)
        .approved()
        .create();

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: '/users/search',
        query: {
          searchQuery: `${lastName}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(
        expect.arrayContaining([expect.objectContaining({ lastName })]),
      );
      expect(response.json().statusFriend).not.toBeNull();
    });

    it('array of users', async () => {
      const user = await User.factory().create();
      const firstName = 'first';
      const lastName = 'last';
      await User.factory().create({ lastName });
      await User.factory().create({ firstName });

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: '/users/search',
        query: {
          searchQuery: `  ${firstName}   ${lastName}   `,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ firstName }),
          expect.objectContaining({ lastName }),
        ]),
      );
    });

    it('only one is matching', async () => {
      const user1 = await User.factory().create();
      const name1 = 'first';
      const name2 = 'ortal';
      await User.factory().create({ firstName: name1 });
      await User.factory().create({ firstName: name2 });

      const response = await app.loginAs(user1).inject({
        method: 'GET',
        url: '/users/search',
        query: {
          searchQuery: ` ${name1}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(
        expect.arrayContaining([expect.objectContaining({ firstName: name1 })]),
      );
      expect(response.json()).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ firstName: name2 })]),
      );
    });

    it('just verified users', async () => {
      const user = await User.factory().create();
      const firstName = 'name';
      const email1 = 'ortal@gmail.com';
      const email2 = 'mail@gmail.com';
      await User.factory().unverified().create({ firstName, email: email1 });
      await User.factory().create({ firstName, email: email2 });

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: '/users/search',
        query: {
          searchQuery: `${firstName}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ email: email1 })]),
      );
      expect(response.json()).toEqual(
        expect.arrayContaining([expect.objectContaining({ email: email2 })]),
      );
    });
  });

  describe("shouldn't return any user", () => {
    it("the user doesn't exist", async () => {
      const user = await User.factory().create();
      const firstName = 'first';
      await User.factory().create({ firstName });

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: '/users/search',
        query: {
          searchQuery: `${firstName}y`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect.arrayContaining([]);
    });

    it('invalid user', async () => {
      const user = await User.factory().create();
      const firstName = 'first';

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: '/users/search',
        query: {
          searchQuery: `${firstName}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect.arrayContaining([]);
    });
  });
});
