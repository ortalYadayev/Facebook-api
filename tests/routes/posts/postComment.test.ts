import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { Post } from '../../../src/entities/post.entity';
import { User } from '../../../src/entities/user.entity';
import { Comment } from '../../../src/entities/comment.entity';

describe('Post Comment', () => {
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

  it('should add a comment to post', async () => {
    const user = await User.factory().create();
    const post = await Post.factory().user(user).create();

    const response = await app.loginAs(user).inject({
      method: 'POST',
      url: `/posts/${post.id}/comments`,
      payload: {
        content: 'comment to the post',
      },
    });

    const comment = await Comment.findOne({
      where: {
        post,
        user,
      },
    });

    expect(response.statusCode).toBe(201);
    expect(await Comment.count()).toBe(1);
    expect(response.json().id).toEqual(comment?.id);
  });

  describe("shouldn't add a comment to post", () => {
    it("post doesn't exist", async () => {
      const user = await User.factory().create();
      await Post.factory().user(user).create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: '/posts/10/comments',
        payload: {
          content: 'comment to the post',
        },
      });
      expect(response.statusCode).toBe(404);
      expect(await Comment.count()).toBe(0);
    });

    it("the content doesn't exist", async () => {
      const user = await User.factory().create();
      const post = await Post.factory().user(user).create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/posts/${post.id}/comments`,
      });

      expect(response.statusCode).toBe(422);
      expect(await Comment.count()).toBe(0);
    });
  });
});
