import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { Post } from '../../../src/entities/post.entity';
import { User } from '../../../src/entities/user.entity';
import { PostLike } from '../../../src/entities/post_like.entity';

describe('Post Unlike', () => {
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

  it('unlike to post', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();
    await PostLike.factory().user(user).post(post).create();

    const response = await app.loginAs(user).inject({
      method: 'DELETE',
      url: `/posts/${post.id}/likes`,
    });

    expect(response.statusCode).toBe(200);
    expect(await PostLike.count()).toBe(0);
  });

  it('unlike to post - there was unlike', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();
    const firstLike = await PostLike.factory().user(user).post(post).create();
    await PostLike.delete(firstLike.id);
    await PostLike.factory().user(user).post(post).create();

    const response = await app.loginAs(user).inject({
      method: 'DELETE',
      url: `/posts/${post.id}/likes`,
    });

    expect(response.statusCode).toBe(200);
    expect(await PostLike.count()).toBe(0);
  });

  describe("shouldn't do unlike to post", () => {
    it("post doesn't exist", async () => {
      const user = await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'DELETE',
        url: '/posts/10/likes',
      });

      expect(response.statusCode).toBe(404);
    });

    it("there's no like to unlike", async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      const like = await PostLike.factory().user(user).post(post).create();
      await PostLike.delete(like.id);

      const response = await app.loginAs(user).inject({
        method: 'DELETE',
        url: `/posts/${post.id}/likes`,
      });

      expect(response.statusCode).toBe(200);
      expect(await PostLike.count()).toBe(0);
    });
  });
});
