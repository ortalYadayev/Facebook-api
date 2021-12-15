import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { Post } from '../../../src/entities/post.entity';
import { User } from '../../../src/entities/user.entity';
import { Comment } from '../../../src/entities/comment.entity';

describe('Get Last Comments', () => {
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

  it('should get comment', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();
    await Comment.factory().user(user).post(post).create();
    const comment = await Comment.factory().user(user).post(post).create();

    const response = await app.loginAs(user).inject({
      method: 'GET',
      url: `/posts/${post.id}/comments/1`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().id).toEqual(comment.id);
    expect(await Comment.count()).toBe(2);
  });

  describe("shouldn't get comment", () => {
    it("post doesn't exist", async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      await Comment.factory().post(post).user(user).create();

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: '/posts/10/comments/1',
      });

      expect(response.statusCode).toBe(422);
    });
  });
});
