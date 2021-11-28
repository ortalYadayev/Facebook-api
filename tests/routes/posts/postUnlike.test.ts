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

  it('unlike to post', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();
    const like = await Like.factory().user(user).post(post).create();

    const response = await app.loginAs(user).inject({
      method: 'DELETE',
      url: `/posts/${post.id}/unlike`,
    });

    await like.reload();

    expect(response.statusCode).toBe(200);
    expect(await Like.count()).toBe(0);
  });

  it('unlike to post - there was unlike', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();
    const firstLike = await Like.factory().user(user).post(post).create();
    await Like.delete(firstLike.id);
    const secondLike = await Like.factory().user(user).post(post).create();

    const response = await app.loginAs(user).inject({
      method: 'DELETE',
      url: `/posts/${post.id}/unlike`,
    });

    await secondLike.reload();

    expect(response.statusCode).toBe(200);
    expect(await Like.count()).toBe(0);
  });

  describe("shouldn't do dislike to post", () => {
    it("post doesn't exist", async () => {
      const user = await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'DELETE',
        url: '/posts/10/unlike',
      });

      expect(response.statusCode).toBe(422);
    });

    it('double click on unlike', async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      const like = await Like.factory().user(user).post(post).create();
      await Like.delete(like.id);

      const response = await app.loginAs(user).inject({
        method: 'DELETE',
        url: `/posts/${post.id}/unlike`,
      });

      expect(response.statusCode).toBe(422);
      expect(await Like.count()).toBe(0);
    });
  });
});
