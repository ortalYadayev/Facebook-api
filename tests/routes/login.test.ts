import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../src/createFastifyInstance';
import { User } from '../../src/entities/user.entity';

describe('Login', () => {
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

  it('should login', async () => {
    const password = 'password';
    const user = await User.factory().defaultImageUrl().create({ password });

    const response = await app.inject({
      method: 'post',
      url: '/login',
      payload: {
        email: user.email,
        password,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().user).toMatchObject(user.toJSON());
    expect(app.jwt.verify(response.json().token)).toMatchObject({
      id: user.id,
    });
  });

  it("should not login if the email doesn't exist", async () => {
    const password = 'password';
    await User.factory().create({
      email: 'ortal@gmail.com',
      password,
    });

    const response = await app.inject({
      method: 'post',
      url: '/login',
      payload: {
        email: 'incorrect@gmail.com',
        password,
      },
    });

    expect(response.statusCode).toBe(422);
  });

  it("should not login if the email isn't verified", async () => {
    const password = 'password';
    const user = await User.factory().unverified().create({ password });

    const response = await app.inject({
      method: 'post',
      url: '/login',
      payload: {
        email: user.email,
        password,
      },
    });

    expect(response.statusCode).toBe(422);
  });

  it('should not login if password is incorrect', async () => {
    const user = await User.factory().create({ password: 'password' });

    const response = await app.inject({
      method: 'post',
      url: '/login',
      payload: {
        email: user.email,
        password: 'incorrect',
      },
    });

    expect(response.statusCode).toBe(422);
  });
});
