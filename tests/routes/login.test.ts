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
    await User.factory().hashPassword('password').create({
      email: 'ortal@gmail.com',
    });

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

    expect(user).not.toBeNull();
    expect(response.statusCode).toBe(200);
    expect(User.comparePasswords('password', user.password)).toBeTruthy();
  });

  it('should not login - email does not exist', async () => {
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
        firstName: 'Ortal',
        lastName: 'Yadaev',
        email: 'ortal@gmail.com',
      },
    })) as User;

    expect(response.statusCode).toBe(422);
    expect(user).toBeUndefined();
  });

  it('should not login - password is incorrect', async () => {
    await User.factory().hashPassword('password').create({
      email: 'ortal@gmail.com',
    });
    const response = await app.inject({
      method: 'post',
      url: '/login',
      payload: {
        email: 'ortal@gmail.com',
        password: 'incorrect',
      },
    });

    const user = (await User.findOne({
      where: {
        email: 'ortal@gmail.com',
      },
    })) as User;

    expect(response.statusCode).toBe(422);
    expect(user).not.toBeNull();
    expect(User.comparePasswords('incorrect', user.password)).not.toBeTruthy();
  });
});
