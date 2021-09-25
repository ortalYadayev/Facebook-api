import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import bcrypt from 'bcrypt';
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
    await app.inject({
      method: 'post',
      url: '/register',
      payload: {
        firstName: 'Ortal',
        lastName: 'Yadaev',
        email: 'ortal@gmail.com',
        password: 'password',
      },
    });

    const response = await app.inject({
      method: 'post',
      url: '/login',
      payload: {
        email: 'ortal@gmail.com',
        password: 'password',
      },
    });

    expect(response.statusCode).toBe(201);
  });

  it('should not login - email does not exist', async () => {
    const response = await app.inject({
      method: 'post',
      url: '/login',
      payload: {
        email: 'ortal1@gmail.com',
        password: 'password',
      },
    });

    expect(response.statusCode).toBe(422);

    const user = (await User.findOne({
      where: {
        firstName: 'Ortal',
        lastName: 'Yadaev',
        email: 'ortal1@gmail.com',
      },
    })) as User;

    expect(user).toBeUndefined();
  });
  it('should not login - password is not correct', async () => {
    await app.inject({
      method: 'post',
      url: '/register',
      payload: {
        firstName: 'Ortal',
        lastName: 'Yadaev',
        email: 'ortal@gmail.com',
        password: 'password',
      },
    });

    const response = await app.inject({
      method: 'post',
      url: '/login',
      payload: {
        email: 'ortal@gmail.com',
        password: 'password1',
      },
    });

    expect(response.statusCode).toBe(422);

    const user = (await User.findOne({
      where: {
        email: 'ortal@gmail.com',
      },
    })) as User;

    expect(user).not.toBeNull();

    expect(await bcrypt.compare('password1', user.password)).not.toBeTruthy();
  });
});
