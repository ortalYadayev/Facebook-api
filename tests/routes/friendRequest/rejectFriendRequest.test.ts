import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { FriendRequest } from '../../../src/entities/friend_request.entity';
import { Friend } from '../../../src/entities/friend.entity';
import { User } from '../../../src/entities/user.entity';

describe('Reject A Friend Request', () => {
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

  it('should reject the friend request', async () => {
    const user = await User.factory().create();
    const receiver = await User.factory().create();
    const friendRequest = await FriendRequest.factory()
      .sender(user)
      .receiver(receiver)
      .create();

    const response = await app.loginAs(receiver).inject({
      method: 'DELETE',
      url: `/friend-requests/${friendRequest.id}/reject`,
    });

    await friendRequest.reload();

    expect(response.statusCode).toBe(200);
    expect(await FriendRequest.count()).toBe(1);
    expect(friendRequest.rejectedAt).not.toBeNull();
  });

  describe("shouldn't reject the friend request", () => {
    it("doesn't exist a friend request", async () => {
      await User.factory().create();
      const receiver = await User.factory().create();

      const response = await app.loginAs(receiver).inject({
        method: 'DELETE',
        url: '/friend-requests/20/reject',
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(0);
    });

    it('already approved', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      const friendRequest = await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .approved()
        .create();
      await Friend.factory()
        .sender(user)
        .receiver(receiver)
        .request(friendRequest)
        .create();

      const response = await app.loginAs(receiver).inject({
        method: 'DELETE',
        url: `/friend-requests/${friendRequest.id}/reject`,
      });

      expect(response.statusCode).toBe(422);
      expect(friendRequest.rejectedAt).toBeNull();
    });

    it("the user who sent the request can't reject", async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      const friendRequest = await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .create();

      const response = await app.loginAs(user).inject({
        method: 'DELETE',
        url: `/friend-requests/${friendRequest.id}/reject`,
      });

      expect(response.statusCode).toBe(422);
      expect(friendRequest.rejectedAt).toBeNull();
    });

    it('the request already deleted', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      const friendRequest = await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .deleted()
        .create();

      const response = await app.loginAs(receiver).inject({
        method: 'DELETE',
        url: `/friend-requests/${friendRequest.id}/reject`,
      });

      expect(response.statusCode).toBe(422);
      expect(friendRequest.rejectedAt).toBeNull();
    });

    it('the request already rejected', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      const friendRequest = await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .rejected()
        .create();

      const response = await app.loginAs(receiver).inject({
        method: 'DELETE',
        url: `/friend-requests/${friendRequest.id}/reject`,
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(1);
      expect(friendRequest.deletedAt).toBeNull();
    });
  });
});
