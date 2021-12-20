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

  it('should get the first 10 posts', async () => {
    const user = await User.factory().create();
    await Post.factory().user(user).create();
    await Post.factory().user(user).create();
    await Post.factory().user(user).create();

    const response = await app.loginAs(user).inject({
      method: 'POST',
      url: `/users/${user.id}/posts`,
      payload: {
        skip: 0,
        page: 1,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).not.toBeNull();
    expect(await Post.count()).toBe(3);
  });

  it('should get empty array', async () => {
    const user = await User.factory().create();

    const response = await app.loginAs(user).inject({
      method: 'POST',
      url: `/users/${user.id}/posts`,
      payload: {
        skip: 0,
        page: 1,
      },
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
        method: 'POST',
        url: '/users/10/posts',
        payload: {
          skip: 0,
          page: 1,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(expect.arrayContaining([]));
    });
  });
});
