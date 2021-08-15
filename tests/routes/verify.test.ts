import {User} from "../../src/entities/user.entity";
import {FastifyInstance} from "fastify";
import {createFastifyInstance} from "../../src/createFastifyInstance";
import {factory, useSeeding} from "typeorm-seeding";
import {createConnection, getConnection} from "typeorm";
import {URLToken} from "../../src/entities/url_token.entity";

describe('Verify', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createFastifyInstance();
  });

  beforeEach(async () => {
    await createConnection();
    await useSeeding();
  })

  afterEach(async () => {
    await getConnection().close();
  })

  afterAll(async () => {
    await app.close();
  });

  it('should verify the user', async () => {
    const user = await factory(User)().create();
    const userVerification = await factory(URLToken)({
      user: user
    }).create();

    const response = await app.inject({
      method: 'get',
      url: '/verify',
      query: {
        token: userVerification.token
      }
    });

    expect(response.statusCode).toBe(200);

    await user.reload();

    expect(user.verifiedAt).not.toBeNull();
  });

  it('should not verify the user - expired token', async () => {
    const dateBeforeMonth = new Date();
    dateBeforeMonth.setMonth(dateBeforeMonth.getMonth() - 1);

    const user = await factory(User)().create();
    const userVerification = await factory(URLToken)({
      user: user,
      createdAt: dateBeforeMonth
    }).create();

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
    const user = await factory(User)().create();

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
    const user = await factory(User)({
      verifiedAt: null,
    }).create();
    const userVerification = await factory(URLToken)({
      user: user,
    }).create();

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
    const user = await factory(User)().create();
    const userVerification = await factory(URLToken)({
      user: user,
    }).create();

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
