import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
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
    const username = 'ortal';
    await User.factory().create({ username });

    const response = await app.loginAs(user).inject({
      method: 'GET',
      url: `/users/friendrequest/${username}`,
    });

    expect(response.statusCode).toBe(200);
  });

  describe("shouldn't send a friend request", () => {
    it('send himself', async () => {
      const username = 'username';
      const user = await User.factory().create({ username });

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/friendrequest/${username}`,
      });

      expect(response.statusCode).toBe(422);
    });

    it("can't send twice", async () => {
      const user = await User.factory().create();
      const username = 'username';
      await User.factory().create({ username });

      await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/friendrequest/${username}`,
      });

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/friendrequest/${username}`,
      });

      expect(response.statusCode).toBe(422);
    });

    it('invalid user', async () => {
      const user = await User.factory().create();
      const username = 'username';

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/friendrequest/${username}`,
      });

      expect(response.statusCode).toBe(404);
    });

    it('incorrect user', async () => {
      const user = await User.factory().create();
      const username = 'username';
      await User.factory().create({ username });

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/users/friendrequest/${username}wo`,
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
