import { FastifyInstance } from 'fastify';
import { createConnection, getConnection } from 'typeorm';
import { UrlToken } from '../../src/entities/url_token.entity';
import createFastifyInstance from '../../src/createFastifyInstance';
import { User } from '../../src/entities/user.entity';

describe('Verify', () => {
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

  it('should verify the user', async () => {
    const user = await User.factory().unverified().create();
    const urlToken = await UrlToken.factory()
      .emailVerification()
      .user(user)
      .create();

    const response = await app.inject({
      method: 'get',
      url: '/verify',
      query: {
        token: urlToken.token,
      },
    });

    await user.reload();
    await urlToken.reload();

    expect(response.statusCode).toBe(200);
    expect(user.verifiedAt).not.toBeNull();
    expect(urlToken.expireAt).toBeNull();
  });

  describe("shouldn't verify the user", () => {
    it('expired token', async () => {
      const user = await User.factory().unverified().create();
      const userVerification = await UrlToken.factory()
        .emailVerification()
        .user(user)
        .expired()
        .create();

      const response = await app.inject({
        method: 'get',
        url: '/verify',
        query: {
          token: userVerification.token,
        },
      });

      await user.reload();

      expect(response.statusCode).toBe(422);
      expect(user.verifiedAt).toBeNull();
    });

    it("token doesn't exist", async () => {
      const user = await User.factory().unverified().create();

      const response = await app.inject({
        method: 'get',
        url: '/verify',
        query: {
          token: '346pq775tg2fdf4r3fg',
        },
      });

      await user.reload();

      expect(response.statusCode).toBe(422);
      expect(user.verifiedAt).toBeNull();
    });

    it('incorrect token', async () => {
      const user = await User.factory().unverified().create();
      const urlToken = await UrlToken.factory()
        .emailVerification()
        .user(user)
        .create();

      const response = await app.inject({
        method: 'get',
        url: '/verify',
        query: {
          token: `${urlToken.token}2d3fd0fc3`,
        },
      });

      await user.reload();

      expect(response.statusCode).toBe(422);
      expect(user.verifiedAt).toBeNull();
    });

    it('the user is already verified', async () => {
      const user = await User.factory().create();
      const userVerification = await UrlToken.factory()
        .emailVerification()
        .user(user)
        .create();

      const response = await app.inject({
        method: 'get',
        url: '/verify',
        query: {
          token: userVerification.token,
        },
      });

      expect(response.statusCode).toBe(422);
    });
  });
});
