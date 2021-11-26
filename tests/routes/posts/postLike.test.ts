import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { Post } from '../../../src/entities/post.entity';
import { User } from '../../../src/entities/user.entity';
import { Like } from '../../../src/entities/like.entity';

describe('Post Like', () => {
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

  it('should add a like to post', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();

    const response = await app.loginAs(user).inject({
      method: 'POST',
      url: `/posts/${post.id}/like`,
    });

    expect(response.statusCode).toBe(201);
    expect(await Like.count()).toBe(1);
  });

  it('should add a like to post - after dislike', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();
    await Like.factory().user(user).post(post).dislike().create();

    const response = await app.loginAs(user).inject({
      method: 'POST',
      url: `/posts/${post.id}/like`,
    });

    expect(response.statusCode).toBe(201);
    expect(await Like.count()).toBe(2);
  });

  describe("shouldn't add a like to post", () => {
    it("post doesn't exist", async () => {
      const user = await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/posts/10/like',
      });

      expect(response.statusCode).toBe(422);
      expect(await Like.count()).toBe(0);
    });

    it('double click on like - dislike', async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      await Like.factory().user(user).post(post).create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/posts/${post.id}/like`,
      });

      expect(response.statusCode).toBe(422);
      expect(await Like.count()).toBe(1);
    });
  });
});
