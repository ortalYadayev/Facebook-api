import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { User } from '../../../src/entities/user.entity';

describe('Post', () => {
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

  it('should add post', async () => {
    const user = await User.factory().create();

    const response = await app.inject({
      method: 'post',
      url: '/posts',
      headers: {
        Authorization: `Bearer ${app.jwt.sign({ id: user.id })}`,
      },
      payload: {
        post: 'post',
        toUser: user,
      },
    });

    expect(response.statusCode).toBe(201);
  });

  it('should not add post because there is not post', async () => {
    const user = await User.factory().create();

    const response = await app.inject({
      method: 'post',
      url: '/posts',
      headers: {
        Authorization: `Bearer ${app.jwt.sign({ id: user.id })}`,
      },
      payload: {
        toUser: user,
      },
    });

    expect(response.statusCode).toBe(422);
  });

  it('should not add post because there is not a user', async () => {
    const response = await app.inject({
      method: 'post',
      url: '/posts',
      payload: {
        post: 'post',
      },
    });

    expect(response.statusCode).toBe(401);
  });
});
