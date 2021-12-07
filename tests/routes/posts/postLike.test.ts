import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { Post } from '../../../src/entities/post.entity';
import { User } from '../../../src/entities/user.entity';
import { PostLike } from '../../../src/entities/post_like.entity';

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

  it('should add like to post', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();

    const response = await app.loginAs(user).inject({
      method: 'POST',
      url: `/posts/${post.id}/likes`,
    });

    expect(response.statusCode).toBe(201);
    expect(await PostLike.count()).toBe(1);
  });

  it('should add a like to post - after unlike', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();
    const like = await PostLike.factory().user(user).post(post).create();

    await PostLike.delete(like.id);

    const response = await app.loginAs(user).inject({
      method: 'POST',
      url: `/posts/${post.id}/likes`,
    });

    expect(response.statusCode).toBe(201);
    expect(await PostLike.count()).toBe(1);
  });

  describe("shouldn't add a like to post", () => {
    it("post doesn't exist", async () => {
      const user = await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/posts/10/likes',
      });

      expect(response.statusCode).toBe(404);
      expect(await PostLike.count()).toBe(0);
    });

    it("there's like", async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      await PostLike.factory().user(user).post(post).create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/posts/${post.id}/likes`,
      });

      expect(response.statusCode).toBe(200);
      expect(await PostLike.count()).toBe(1);
    });
  });
});
