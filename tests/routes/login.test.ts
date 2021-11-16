import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../src/createFastifyInstance';
import { User } from '../../src/entities/user.entity';

describe('Login', () => {
  let app: FastifyInstance;
  let connection: Connection;

  beforeAll(async () => {
    app = await createFastifyInstance();
  });

  beforeEach(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterEach(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should login', async () => {
    const password = 'password';
    const user = await User.factory().create({ password });

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
  describe("shouldn't login", () => {
    it("the email doesn't exist", async () => {
      const password = 'password';

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

    it("the email isn't verified", async () => {
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

    it('password is incorrect', async () => {
      const password = 'password';
      const user = await User.factory().create({ password });

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
});
