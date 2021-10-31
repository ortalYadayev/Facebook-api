import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { User } from '../../../src/entities/user.entity';

describe('Friends', () => {
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

  it('should send the request', async () => {
    const user = await User.factory().create();
    const username = 'ortal';
    await User.factory().create({ username });

    const response = await app.loginAs(user).inject({
      method: 'GET',
      url: `/users/friends/${username}`,
    });

    expect(response.statusCode).toBe(200);
  });

  describe("shouldn't send a request", () => {
    it('send himself', async () => {
      const username = 'username';
      const user = await User.factory().create({ username });

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/friends/${username}`,
      });

      expect(response.statusCode).toBe(422);
    });

    it("can't send twice", async () => {
      const user = await User.factory().create();
      const username = 'username';
      await User.factory().create({ username });

      await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/friends/${username}`,
      });

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/friends/${username}`,
      });

      expect(response.statusCode).toBe(422);
    });

    it('invalid user', async () => {
      const user = await User.factory().create();
      const username = 'username';

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/friends/${username}`,
      });

      expect(response.statusCode).toBe(422);
    });

    it('incorrect user', async () => {
      const user = await User.factory().create();
      const username = 'username';
      await User.factory().create({ username });

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/friends/${username}wo`,
      });

      expect(response.statusCode).toBe(422);
    });
  });
});
