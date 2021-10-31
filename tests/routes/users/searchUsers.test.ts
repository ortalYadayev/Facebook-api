import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { User } from '../../../src/entities/user.entity';

describe('Search', () => {
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

  describe('should return matching users', () => {
    it('by first name', async () => {
      const user = await User.factory().create();
      const firstName = 'name';
      await User.factory().create({ firstName });

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
    });

    it('by last name', async () => {
      const user = await User.factory().create();
      const lastName = 'name';
      await User.factory().create({ lastName });

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
          searchQuery: `${firstName} ${lastName}`,
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
          searchQuery: `${name1}`,
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
      // );
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
