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

  it.only('should add post', async () => {
    const user = await User.factory().create();

    const response = await app.inject({
      method: 'post',
      url: '/posts',
      payload: {
        post: 'post',
        from: user.id,
        to: user.id,
      },
    });

    expect(response.json()).toMatchObject(user.toJSON());
  });
});
