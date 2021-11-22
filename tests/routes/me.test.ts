import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../src/createFastifyInstance';
import { User } from '../../src/entities/user.entity';

describe('Me', () => {
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

  it('should return user from token', async () => {
    const user = await User.factory().create();

    const response = await app.loginAs(user).inject({
      method: 'post',
      url: '/me',
    });

    expect(response.json().id).toEqual(user.toJSON().id);
  });
});
