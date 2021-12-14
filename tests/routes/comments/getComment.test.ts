import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { Post } from '../../../src/entities/post.entity';
import { User } from '../../../src/entities/user.entity';
import { Comment } from '../../../src/entities/comment.entity';

describe('Get Comments', () => {
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

  describe('should get comments', () => {
    it('until 5 comments', async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      await Comment.factory().user(user).post(post).create();

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/posts/${post.id}/comments`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().comments).not.toBeNull();
      expect(response.json().count).toBe(1);
    });

    it('over 5 comments', async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      await Comment.factory().user(user).post(post).create();
      await Comment.factory().user(user).post(post).create();
      await Comment.factory().user(user).post(post).create();
      await Comment.factory().user(user).post(post).create();
      await Comment.factory().user(user).post(post).create();
      await Comment.factory().user(user).post(post).create();
      const post2 = await Post.factory().user(user).create();
      await Comment.factory().user(user).post(post2).create();

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: `/posts/${post.id}/comments`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().comments).toEqual(expect.arrayContaining([]));
      expect(response.json().count).toBe(6);
    });
  });

  describe("shouldn't get comments", () => {
    it("comment doesn't exist", async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      await Comment.factory().post(post).user(user).create();

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: '/posts/10/comments',
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().comments).toEqual(expect.arrayContaining([]));
      expect(response.json().count).toBe(0);
    });
  });
});
