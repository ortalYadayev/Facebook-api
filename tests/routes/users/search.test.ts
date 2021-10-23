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

  describe('should return a user', () => {
    it('by first name', async () => {
      const user = await User.factory().create();
      const firstName = 'name';
      await User.factory().create({ firstName });

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/search`,
        payload: {
          body: firstName,
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
        method: 'POST',
        url: `/search`,
        payload: {
          body: lastName,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(
        expect.arrayContaining([expect.objectContaining({ lastName })]),
      );
    });
  });

  it('should return users', async () => {
    const user = await User.factory().create();
    const firstName = 'first';
    const lastName = 'last';
    await User.factory().create({ firstName, lastName });
    await User.factory().create({ firstName, lastName });

    const response = await app.loginAs(user).inject({
      method: 'POST',
      url: `/search`,
      payload: {
        body: `${firstName} ${lastName}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ firstName, lastName }),
      ]),
    );
  });

  describe("shouldn't return any user", () => {
    it("the user doesn't exist", async () => {
      const user = await User.factory().create();
      const firstName = 'first';
      const lastName = 'last';
      await User.factory().create({ firstName, lastName });

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/search`,
        payload: {
          body: `${firstName}w ${lastName}y`,
        },
      });

      expect(response.statusCode).toBe(422);
    });
  });
});
