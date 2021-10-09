import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { User } from '../../../src/entities/user.entity';

describe('Me', () => {
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

  it('should receive error if there is no token', async () => {
    await User.factory().create();

    const response = await app.inject({
      method: 'post',
      url: '/me',
    });

    expect(response.statusCode).toBe(401);
  });

  it('should receive error if there is an invalid token', async () => {
    await User.factory().create();

    const response = await app.inject({
      method: 'post',
      url: '/me',
      headers: {
        Authorization: `Bearer invalid-token`,
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it('should not return show if the show has removed', async () => {
    const user = await User.factory().create();

    await User.delete(user.id);

    const response = await app.loginAs(user).inject({
      method: 'post',
      url: '/me',
    });

    expect(await User.count()).toBe(0);
    expect(response.statusCode).toBe(401);
  });
});
