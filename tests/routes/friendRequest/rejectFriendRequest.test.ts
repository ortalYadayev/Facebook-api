import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { FriendRequest } from '../../../src/entities/friend_request.entity';
import { Friend } from '../../../src/entities/friend.entity';
import { User } from '../../../src/entities/user.entity';

describe('Reject A Friend Request', () => {
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

    const response = await app.loginAs(receiver).inject({
      method: 'POST',
      url: `/friend-requests/reject`,
      payload: { id: user.id },
    });

    await friendRequest.reload();

    expect(response.statusCode).toBe(200);
    expect(await FriendRequest.count()).toBe(1);
    expect(friendRequest.deletedAt).not.toBeNull();
  });

  describe("shouldn't delete the friend request", () => {
    it("doesn't exist a friend request", async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();

      const response = await app.loginAs(receiver).inject({
        method: 'POST',
        url: `/friend-requests/reject`,
        payload: { id: user.id },
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(0);
    });

    it("the user who sent can't delete", async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      const friendRequest = await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .rejected()
        .create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/friend-requests/reject`,
        payload: { id: receiver.id },
      });

      expect(response.statusCode).toBe(422);
      expect(friendRequest.deletedAt).toBeNull();
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
        method: 'POST',
        url: `/friend-requests/reject`,
        payload: { id: user.id },
      });

      expect(response.statusCode).toBe(422);
      expect(friendRequest.rejectedAt).toBeNull();
    });

    it('the request rejected', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      const friendRequest = await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .rejected()
        .create();

      const response = await app.loginAs(receiver).inject({
        method: 'POST',
        url: `/friend-requests/reject`,
        payload: { id: user.id },
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(1);
      expect(friendRequest.deletedAt).toBeNull();
    });
  });
});
