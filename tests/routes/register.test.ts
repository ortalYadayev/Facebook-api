import {User} from "../../src/entities/user.entity";
import {FastifyInstance} from "fastify";
import {createFastifyInstance} from "../../src/createFastifyInstance";
import {factory, useSeeding} from "typeorm-seeding";
import {createConnection, getConnection} from "typeorm";

describe('Register', () => {
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

  it('should register', async () => {
    const response = await app.inject({
      method: 'post',
      url: '/register',
      payload: {
        first_name: 'Ortal',
        last_name: 'Yadaev',
        email: 'ortal@gmail.com',
        password: 'secret',
      }
    });

    expect(response.statusCode).toBe(201);

    expect(await User.count()).toBe(1);
  });

  it("shouldn't register - existing email", async () => {
    await factory(User)({
      email: 'ortal@gmail.com'
    }).create();

    const response = await app.inject({
      method: 'post',
      url: '/register',
      payload: {
        first_name: 'Ortal',
        last_name: 'Yadaev',
        email: 'ortal@gmail.com',
        password: 'secret',
      }
    });

    expect(response.statusCode).toBe(422);

    expect(await User.count()).toBe(1);
  });

  it("shouldn't register - invalid email", async () => {
    const response = await app.inject({
      method: 'post',
      url: '/register',
      payload: {
        first_name: 'Ortal',
        last_name: 'Yadaev',
        email: 'ortal@gmail.com',
        password: 'secret',
      }
    });

    expect(response.statusCode).toBe(201);

    expect(await User.count()).toBe(0);
  });
});