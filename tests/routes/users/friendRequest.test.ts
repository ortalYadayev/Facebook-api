import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { Friend, FriendEnum } from '../../../src/entities/friend.entity';
import { User } from '../../../src/entities/user.entity';

describe('Friend Requests', () => {
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

  it('should send a friend request', async () => {
    const user = await User.factory().create();
    const username = 'ortal';
    const receiver = await User.factory().create({ username });

    const response = await app.loginAs(user).inject({
      method: 'GET',
      url: '/users/friendrequest',
      query: {
        username,
      },
    });

    const friend = (await Friend.findOne({
      where: {
        sender: user,
        receiver,
      },
    })) as Friend;

    expect(response.statusCode).toBe(200);
    expect(await Friend.count()).toBe(1);
    expect(friend).not.toBeNull();
    expect(friend.status).toEqual(FriendEnum.PENDING);
  });

  it('should delete a friend request', async () => {
    const user = await User.factory().create();
    const username = 'ortal';
    const receiver = await User.factory().create({ username });

    await app.loginAs(user).inject({
      method: 'GET',
      url: '/users/friendrequest',
      query: {
        username,
      },
    });

    const response = await app.loginAs(user).inject({
      method: 'GET',
      url: '/users/friendrequest',
      query: {
        username,
      },
    });

    const friend = (await Friend.findOne({
      where: {
        sender: user,
        receiver,
      },
    })) as Friend;

    expect(response.statusCode).toBe(200);
    expect(await Friend.count()).toBe(1);
    expect(friend.status).toEqual(FriendEnum.DELETED);
  });

  describe("shouldn't send a friend request", () => {
    it('send himself', async () => {
      const username = 'username';
      const user = await User.factory().create({ username });

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: '/users/friendrequest',
        query: {
          username,
        },
      });

      expect(response.statusCode).toBe(422);
      expect(await Friend.count()).toBe(0);
    });

    it('invalid user', async () => {
      const user = await User.factory().create();
      const username = 'username';

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: '/users/friendrequest',
        query: {
          username,
        },
      });

      expect(response.statusCode).toBe(404);
      expect(await Friend.count()).toBe(0);
    });

    it('incorrect user', async () => {
      const user = await User.factory().create();
      const username = 'username';
      await User.factory().create({ username });

      const response = await app.loginAs(user).inject({
        method: 'GET',
        url: '/users/friendrequest',
        query: {
          username: `${username}wo`,
        },
      });

      expect(response.statusCode).toBe(404);
      expect(await Friend.count()).toBe(0);
    });
  });
});
