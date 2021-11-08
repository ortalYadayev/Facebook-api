import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { FriendRequest } from '../../../src/entities/friend_request.entity';
import { Friend } from '../../../src/entities/friend.entity';
import { User } from '../../../src/entities/user.entity';

describe('Remove A Friendship', () => {
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

  describe('should remove the friendship', () => {
    it('by the friend who approved', async () => {
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
        url: `/friend-requests/remove`,
        payload: { id: user.id },
      });

      const friend = await Friend.findOne({
        where: {
          sender: user,
          receiver,
          deletedBy: receiver,
        },
      });

      await friendRequest.reload();

      expect(response.statusCode).toBe(200);
      expect(await FriendRequest.count()).toBe(1);
      expect(friendRequest.deletedAt).not.toBeNull();
      expect(await Friend.count()).toBe(1);
      expect(friend?.deletedAt).not.toBeNull();
      expect(response.json().statusFriend).toMatchObject({});
    });

    it('by the friend who sent', async () => {
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
        url: `/friend-requests/remove`,
        payload: { id: receiver.id },
      });

      const friend = await Friend.findOne({
        where: {
          sender: receiver,
          receiver: user,
          deletedBy: user,
        },
      });

      await friendRequest.reload();

      expect(response.statusCode).toBe(200);
      expect(await FriendRequest.count()).toBe(1);
      expect(friendRequest.deletedAt).not.toBeNull();
      expect(await Friend.count()).toBe(1);
      expect(friend?.deletedAt).not.toBeNull();
      expect(response.json().statusFriend).toMatchObject({});
    });
  });

  describe("shouldn't remove the friend request", () => {
    it("doesn't exist a friend request", async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();

      const response = await app.loginAs(receiver).inject({
        method: 'DELETE',
        url: `/friend-requests/remove`,
        payload: { id: user.id },
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(0);
    });

    it('the friend request is still awaiting approval', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      await FriendRequest.factory().sender(user).receiver(receiver).create();

      const response = await app.loginAs(receiver).inject({
        method: 'DELETE',
        url: `/friend-requests/remove`,
        payload: { id: user.id },
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(1);
    });

    it('the friendship already removed', async () => {
      const user = await User.factory().create();
      const receiver = await User.factory().create();
      const friendRequest = await FriendRequest.factory()
        .sender(user)
        .receiver(receiver)
        .approved()
        .deleted()
        .create();
      await Friend.factory()
        .sender(user)
        .receiver(receiver)
        .request(friendRequest)
        .deletedBy(user)
        .create();

      const response = await app.loginAs(receiver).inject({
        method: 'DELETE',
        url: `/friend-requests/remove`,
        payload: { id: user.id },
      });

      expect(response.statusCode).toBe(422);
      expect(await FriendRequest.count()).toBe(1);
    });
  });
});
