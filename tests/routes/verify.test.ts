import {User} from "../../src/entities/user.entity";
import {FastifyInstance} from "fastify";
import {createFastifyInstance} from "../../src/createFastifyInstance";
import { factory, useRefreshDatabase, useSeeding } from "typeorm-seeding";
import { createConnection, getConnection, getConnectionOptions } from "typeorm";
import {URLToken} from "../../src/entities/url_token.entity";
import moment from "moment";

describe('Verify', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createFastifyInstance();
  });

  beforeEach(async () => {
    await createConnection();
  })

  afterEach(async () => {
    await getConnection().close();
  })

  afterAll(async () => {
    await app.close();
  });

  it('should verify the user', async () => {
    const user = await User.factory().create();
    const urlToken = await URLToken.factory().create({
      user: user
    });

    const response = await app.inject({
      method: 'get',
      url: '/verify',
      query: {
        token: urlToken.token
      }
    });

    expect(response.statusCode).toBe(200);

    await user.reload();
    await urlToken.reload();

    expect(user.verifiedAt).not.toBeNull();
    expect(urlToken.expireAt).toBeNull();
  });

  it('should not verify the user - expired token', async () => {
    const dateBeforeMonth = moment().subtract(1, 'month').toDate();

    const user = await User.factory().create();
    const userVerification = await URLToken.factory().create({
      user: user,
      created_at: dateBeforeMonth
    });

    const response = await app.inject({
      method: 'get',
      url: '/verify',
      query: {
        token: userVerification.token
      }
    });

    expect(response.statusCode).toBe(422);

    await user.reload();

    expect(user.verifiedAt).toBeNull();
  });

  it('should not verify the user - token not exists', async () => {
    const user = await User.factory().create();

    const response = await app.inject({
      method: 'get',
      url: '/verify',
      query: {
        token: '346pq775tg2fdf4r3fg'
      }
    });

    expect(response.statusCode).toBe(422);

    await user.reload();

    expect(user.verifiedAt).toBeNull();
  });

  it('should not verify the user - incorrect token', async () => {
    const user = await User.factory().create({
      verifiedAt: null,
    });
    const userVerification = await URLToken.factory().create({
      user: user,
    });

    const response = await app.inject({
      method: 'get',
      url: '/verify',
      query: {
        token: '12dse3c'
      }
    });

    expect(response.statusCode).toBe(422);

    await user.reload();

    expect(user.verifiedAt).toBeNull();
  });

  it('should not verify the user - the user is already verified', async () => {
    const user = await User.factory().create();
    const userVerification = await URLToken.factory().create({
      user: user,
    });

    const response = await app.inject({
      method: 'get',
      url: '/verify',
      query: {
        token: userVerification.token,
      }
    });

    expect(response.statusCode).toBe(422);
  });
});
