import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { FriendRequest } from '../../../src/entities/friend_request.entity';
import { Friend } from '../../../src/entities/friend.entity';
import { User } from '../../../src/entities/user.entity';

describe('Approve', () => {
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

  it('should approve the friend request', async () => {
    const user = await User.factory().create();
    const receiver = await User.factory().create();
    const friendRequest = await FriendRequest.factory()
      .sender(user)
      .receiver(receiver)
      .create();

    const response = await app.loginAs(receiver).inject({
      method: 'POST',
      url: `/friend-requests/${friendRequest.id}/approve`,
    });

    const friend = await Friend.findOne({
      where: {
        sender: user,
        receiver,
        deletedBy: null,
        deletedAt: null,
      },
    });

    await friendRequest.reload();

    expect(response.statusCode).toBe(201);
    expect(await FriendRequest.count()).toBe(1);
    expect(friendRequest.approvedAt).not.toBeNull();
    expect(await Friend.count()).toBe(1);
    expect(friend).not.toBeNull();
    expect(friend?.request).not.toBeNull();
    expect(friend?.request).toMatchObject(friendRequest);
  });

  describe("shouldn't approve the friend request", () => {
    it("doesn't exist a friend request", async () => {
      await User.factory().create();
      const receiver = await User.factory().create();

      const response = await app.loginAs(receiver).inject({
        method: 'POST',
        url: `/friend-requests/1/approved`,
      });

      expect(response.statusCode).toBe(404);
      expect(await FriendRequest.count()).toBe(0);
      expect(await Friend.count()).toBe(0);
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
        url: `/friend-requests/${friendRequest.id}/approve`,
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(1);
      expect(await Friend.count()).toBe(1);
    });

    it('the request deleted', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      const friendRequest = await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .deleted()
        .create();

      const response = await app.loginAs(receiver).inject({
        method: 'POST',
        url: `/friend-requests/${friendRequest.id}/approve`,
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(1);
      expect(await Friend.count()).toBe(0);
    });
  });
});
