import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { FriendRequest } from '../../../src/entities/friend_request.entity';
import { Friend } from '../../../src/entities/friend.entity';
import { User } from '../../../src/entities/user.entity';

describe('Delete A Friend Request', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createFastifyInstance();
  });

  beforeEach(async () => {
    await createConnection();
  });

  afterEach(async () => {
    await getConnection().close();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should delete the friend request', async () => {
    const user = await User.factory().create();
    const receiver = await User.factory().create();
    const friendRequest = await FriendRequest.factory()
      .sender(user)
      .receiver(receiver)
      .create();

    const response = await app.loginAs(user).inject({
      method: 'DELETE',
      url: `/friend-requests/${friendRequest.id}`,
    });

    await friendRequest.reload();

    expect(response.statusCode).toBe(200);
    expect(await FriendRequest.count()).toBe(1);
    expect(friendRequest.deletedAt).not.toBeNull();
  });

  describe("shouldn't delete the friend request", () => {
    it("doesn't exist a friend request", async () => {
      const user = await User.factory().create();
      await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'DELETE',
        url: '/friend-requests/2',
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

      const response = await app.loginAs(user).inject({
        method: 'DELETE',
        url: `/friend-requests/${friendRequest.id}`,
      });

      expect(response.statusCode).toBe(422);
      expect(friendRequest.deletedAt).toBeNull();
    });

    it("the user who received the request can't delete", async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      const friendRequest = await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .create();

      const response = await app.loginAs(receiver).inject({
        method: 'DELETE',
        url: `/friend-requests/${friendRequest.id}`,
      });

      expect(response.statusCode).toBe(422);
      expect(friendRequest.deletedAt).toBeNull();
    });

    it('the request already rejected', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      const friendRequest = await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .rejected()
        .create();

      const response = await app.loginAs(user).inject({
        method: 'DELETE',
        url: `/friend-requests/${friendRequest.id}`,
      });

      expect(response.statusCode).toBe(422);
      expect(friendRequest.deletedAt).toBeNull();
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
        url: `/friend-requests/${friendRequest.id}`,
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(1);
      expect(friendRequest.rejectedAt).toBeNull();
    });
  });
});
