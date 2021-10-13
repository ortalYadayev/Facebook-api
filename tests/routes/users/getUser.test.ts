import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { User } from '../../../src/entities/user.entity';

describe('Show user', () => {
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

  it('should return a user', async () => {
    const username = 'username';

    const user = await User.factory().create({
      username,
    });

    const response = await app.loginAs(user).inject({
      method: 'GET',
      url: `/users/${username}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject(user.toJSON());
  });

  it('should not return a user - not exists user', async () => {
    const user = await User.factory().create();

    const response = await app.loginAs(user).inject({
      method: 'GET',
      url: '/users/invalid',
    });

    expect(response.statusCode).toBe(404);
  });

  it('should not return a user - not token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users/username',
    });

    expect(response.statusCode).toBe(401);
  });
});
