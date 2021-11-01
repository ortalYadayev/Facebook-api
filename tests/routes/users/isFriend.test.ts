import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { Friend } from '../../../src/entities/friend.entity';
import { User } from '../../../src/entities/user.entity';

describe('Friend', () => {
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

  it('sent a friend request', async () => {
    const user = await User.factory().create();
    const username = 'ortal';
    await User.factory().create({ username });

    await app.loginAs(user).inject({
      method: 'GET',
      url: '/users/friendrequest',
      query: {
        username,
      },
    });

    const response = await app.loginAs(user).inject({
      method: 'GET',
      url: '/users/friends',
      query: {
        username,
      },
    });

    expect(response.statusCode).toBe(200);
  });

  it("didn't send a friend request", async () => {
    const user = await User.factory().create();
    const username = 'ortal';
    await User.factory().create({ username });

    const response = await app.loginAs(user).inject({
      method: 'GET',
      url: '/users/friends',
      query: {
        username,
      },
    });

    expect(response.statusCode).toBe(422);
    expect(await Friend.count()).toBe(0);
  });
});
