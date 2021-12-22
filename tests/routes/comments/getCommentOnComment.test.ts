import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { Post } from '../../../src/entities/post.entity';
import { User } from '../../../src/entities/user.entity';
import { Comment } from '../../../src/entities/comment.entity';

describe('Get Comment On Comment', () => {
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

  describe('should return a comment to comment', () => {
    it('a first page', async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      const comment = await Comment.factory().user(user).post(post).create();
      const commentOn = await Comment.factory()
        .user(user)
        .comment(comment)
        .create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/comments/${comment.id}/comments/5`,
        payload: {
          skip: 0,
          page: 1,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(await Comment.count()).toBe(2);
      expect(response.json().comments).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: commentOn.id })]),
      );
      expect(response.json().comments.length).toBe(1);
    });

    it('a last page and start 2 comments later', async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      const comment = await Comment.factory().user(user).post(post).create();
      for (let i = 0; i < 6; i++) {
        await Comment.factory().user(user).comment(comment).create();
      }

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/comments/${comment.id}/comments/5`,
        payload: {
          skip: 2,
          page: 1,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(await Comment.count()).toBe(7);
      expect(response.json().comments).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ id: comment.id })]),
      );
      expect(response.json().comments).not.toBeNull();
      expect(response.json().comments.length).toBe(4);
    });

    it('a last page', async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      const comment = await Comment.factory().user(user).post(post).create();
      for (let i = 0; i < 6; i++) {
        await Comment.factory().user(user).comment(comment).create();
      }

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/comments/${comment.id}/comments/5`,
        payload: {
          skip: 0,
          page: 2,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(await Comment.count()).toBe(7);
      expect(response.json().comments).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ id: comment.id })]),
      );
      expect(response.json().comments).not.toBeNull();
      expect(response.json().comments.length).toBe(1);
    });

    it('a last page and start 2 comments later', async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      const comment = await Comment.factory().user(user).post(post).create();
      for (let i = 0; i < 9; i++) {
        await Comment.factory().user(user).comment(comment).create();
      }

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/comments/${comment.id}/comments/5`,
        payload: {
          skip: 2,
          page: 2,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(await Comment.count()).toBe(10);
      expect(response.json().comments).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ id: comment.id })]),
      );
      expect(response.json().comments.length).toBe(2);
    });
  });

  describe("shouldn't return a comment to comment", () => {
    it("comment doesn't exist", async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      const comment = await Comment.factory().post(post).user(user).create();
      await Comment.factory().user(user).comment(comment).create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/comments/10/comments/5',
        payload: {
          skip: 0,
          page: 1,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(await Comment.count()).toBe(2);
    });

    it("the page doesn't exist", async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      const comment = await Comment.factory().post(post).user(user).create();
      await Comment.factory().user(user).comment(comment).create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/comments/${comment.id}/comments/5`,
        payload: {
          skip: 0,
          page: 12,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(await Comment.count()).toBe(2);
    });

    it("there aren't comments", async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      const comment = await Comment.factory().post(post).user(user).create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/comments/${comment.id}/comments/5`,
        payload: {
          skip: 0,
          page: 1,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(await Comment.count()).toBe(1);
    });

    it('Skip a lot and no more comments', async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      const comment = await Comment.factory().post(post).user(user).create();
      await Comment.factory().user(user).comment(comment).create();
      await Comment.factory().user(user).comment(comment).create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/comments/${comment.id}/comments/5`,
        payload: {
          skip: 5,
          page: 1,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(await Comment.count()).toBe(3);
    });
  });
});
