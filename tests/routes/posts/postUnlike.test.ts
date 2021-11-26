import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { Post } from '../../../src/entities/post.entity';
import { User } from '../../../src/entities/user.entity';
import { Like } from '../../../src/entities/like.entity';

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

  it('dislike to post', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();
    const like = await Like.factory().user(user).post(post).create();

    const response = await app.loginAs(user).inject({
      method: 'DELETE',
      url: `/posts/${post.id}/dislike`,
    });

    await like.reload();

    expect(response.statusCode).toBe(200);
    expect(await Like.count()).toBe(1);
    expect(like.dislikeAt).not.toBeNull();
  });

  it('dislike to post - there was dislike', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();
    await Like.factory().user(user).post(post).dislike().create();
    const like = await Like.factory().user(user).post(post).create();

    const response = await app.loginAs(user).inject({
      method: 'DELETE',
      url: `/posts/${post.id}/dislike`,
    });

    await like.reload();

    expect(response.statusCode).toBe(200);
    expect(like.dislikeAt).not.toBeNull();
  });

  describe("shouldn't do dislike to post", () => {
    it("post doesn't exist", async () => {
      const user = await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'DELETE',
        url: '/posts/10/dislike',
      });

      expect(response.statusCode).toBe(422);
    });

    it('double click on dislike - dislike', async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      await Like.factory().user(user).post(post).dislike().create();

      const response = await app.loginAs(user).inject({
        method: 'DELETE',
        url: `/posts/${post.id}/dislike`,
      });

      expect(response.statusCode).toBe(422);
      expect(await Like.count()).toBe(1);
    });
  });
});
