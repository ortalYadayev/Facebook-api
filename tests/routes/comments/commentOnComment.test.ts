import { FastifyInstance } from 'fastify';
import { Connection, createConnection, IsNull } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { Post } from '../../../src/entities/post.entity';
import { User } from '../../../src/entities/user.entity';
import { Comment } from '../../../src/entities/comment.entity';

describe('Comment On Comment', () => {
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

  it('should add a comment to comment', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();
    const comment = await Comment.factory().user(user).post(post).create();

    const response = await app.loginAs(user).inject({
      method: 'POST',
      url: `/comments/${comment.id}/comments`,
      payload: {
        content: 'comment to the comment',
      },
    });

    const commentOnComment = await Comment.findOne({
      where: {
        comment,
        post: IsNull(),
        user,
      },
    });

    expect(response.statusCode).toBe(201);
    expect(await Comment.count()).toBe(2);
    expect(response.json().id).toEqual(commentOnComment?.id);
  });

  describe("shouldn't add a comment to comment", () => {
    it("comment doesn't exist", async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      await Comment.factory().post(post).user(user).create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/comments/20/comments',
        payload: {
          content: 'comment to the comment',
        },
      });

      expect(response.statusCode).toBe(404);
      expect(await Comment.count()).toBe(1);
    });

    it("the content doesn't exist", async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();
      const comment = await Comment.factory().post(post).user(user).create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/comments/${comment.id}/comments`,
      });

      expect(response.statusCode).toBe(422);
      expect(await Comment.count()).toBe(1);
    });
  });
});
