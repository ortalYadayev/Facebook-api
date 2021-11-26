import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { Post } from '../../../src/entities/post.entity';
import { User } from '../../../src/entities/user.entity';

describe('Get Posts', () => {
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

  it('should get posts', async () => {
    const user = await User.factory().create();
    await Post.factory().user(user).create();
    await Post.factory().user(user).create();
    await Post.factory().user(user).create();

    const response = await app.loginAs(user).inject({
      method: 'GET',
      url: `/${user.id}/posts`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).not.toBeNull();
  });

  it('should get empty array', async () => {
    const user = await User.factory().create();

    const response = await app.loginAs(user).inject({
      method: 'GET',
      url: `/${user.id}/posts`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(expect.arrayContaining([]));
  });

  describe("shouldn't get posts", () => {
    it("the user doesn't exist", async () => {
      const user = await User.factory().create();
      await User.factory().create();
      await Post.factory().user(user).create();
      await Post.factory().user(user).create();

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: '/10/posts',
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(expect.arrayContaining([]));
    });
  });
});
