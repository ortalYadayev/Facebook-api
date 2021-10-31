import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { User } from '../../../src/entities/user.entity';

describe('Store Post', () => {
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

  it('should add a post', async () => {
    const user = await User.factory().create();

    const response = await app.loginAs(user).inject({
      method: 'POST',
      url: `/posts`,
      payload: {
        content: 'content',
      },
    });

    expect(response.statusCode).toBe(201);
  });

  describe("shouldn't add a post", () => {
    it('there is not a content', async () => {
      const user = await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/posts`,
      });

      expect(response.statusCode).toBe(422);
    });
  });
});
