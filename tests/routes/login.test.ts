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

  it('should login with correct credentials', async () => {
    await User.factory().create({
      email: 'ortal@gmail.com',
      password: 'password',
    });

    const response = await app.inject({
      method: 'post',
      url: '/login',
      payload: {
        email: 'ortal@gmail.com',
        password: 'password',
      },
    });

    expect(response.statusCode).toBe(200);
  });

  it("should not login if the email doesn't exist", async () => {
    const response = await app.inject({
      method: 'post',
      url: '/login',
      payload: {
        email: 'ortal@gmail.com',
        password: 'password',
      },
    });

    const user = (await User.findOne({
      where: {
        email: 'ortal@gmail.com',
      },
    })) as User;

    expect(response.statusCode).toBe(422);
    expect(user).toBeUndefined();
  });

  it('should not login if password is incorrect', async () => {
    await User.factory().create({
      email: 'ortal@gmail.com',
      password: 'password',
    });

    const response = await app.inject({
      method: 'post',
      url: '/login',
      payload: {
        email: 'ortal@gmail.com',
        password: 'incorrect',
      },
    });

    expect(response.statusCode).toBe(422);
  });
});
