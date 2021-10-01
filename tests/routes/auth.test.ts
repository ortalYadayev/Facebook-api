import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../src/createFastifyInstance';
import { User } from '../../src/entities/user.entity';

describe('Auth', () => {
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

  it('should return user from token', async () => {
    const user = await User.factory().create({
      email: 'ortal@gmail.com',
      password: 'password',
    });

    const token = app.jwt.sign({ id: user.id });

    const response = await app.inject({
      method: 'post',
      url: '/auth',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.json().user).toMatchObject(user.toJSON());
  });

  it('should receive error if there is no token', async () => {
    const response = await app.inject({
      method: 'post',
      url: '/auth',
    });

    expect(response.statusCode).toBe(401);
  });

  it('should receive error if there is an invalid token', async () => {
    const user = await User.factory().create({
      email: 'ortal@gmail.com',
      password: 'password',
    });

    const token = app.jwt.sign({ id: user.id });

    const response = await app.inject({
      method: 'post',
      url: '/login',
      payload: {
        email: 'ortal@gmail.com',
        password: 'incorrect',
      },
      headers: {
        Authorization: `Bearer ${token}-invalid`,
      },
    });

    expect(response.statusCode).toBe(422);
  });
});
