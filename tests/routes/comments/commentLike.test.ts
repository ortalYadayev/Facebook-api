import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { Post } from '../../../src/entities/post.entity';
import { User } from '../../../src/entities/user.entity';
import { Comment } from '../../../src/entities/comment.entity';
import { Like } from '../../../src/entities/like.entity';

describe('Comment Like', () => {
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

  it('like to comment', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();
    const comment = await Comment.factory().post(post).user(user).create();

    const response = await app.loginAs(user).inject({
      method: 'POST',
      url: `/comments/${comment.id}/likes`,
    });

    expect(response.statusCode).toBe(201);
    expect(await Like.count()).toBe(1);
  });

  it('should add a like to comment - after unlike', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();
    const comment = await Comment.factory().post(post).user(user).create();
    const like = await Like.factory().user(user).comment(comment).create();

    await Like.delete(like.id);

    const response = await app.loginAs(user).inject({
      method: 'POST',
      url: `/comments/${comment.id}/likes`,
    });

    expect(response.statusCode).toBe(201);
    expect(await Like.count()).toBe(1);
  });

  describe("shouldn't add a like to comment", () => {
    it("comment doesn't exist", async () => {
      const user = await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/comments/10/likes`,
      });

      expect(response.statusCode).toBe(404);
      expect(await Like.count()).toBe(0);
    });

    it("there's like", async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      const comment = await Comment.factory().post(post).user(user).create();
      await Like.factory().user(user).comment(comment).create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/comments/${comment.id}/likes`,
      });

      expect(response.statusCode).toBe(200);
      expect(await Like.count()).toBe(1);
    });
  });
});
