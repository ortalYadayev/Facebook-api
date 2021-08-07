import {getRepository} from "typeorm";
import {User} from "../../src/entities/User";
import {FastifyInstance} from "fastify";
import {connection} from "../helpers/connection";
import {createFastifyInstance} from "../../src/createFastifyInstance";

describe('Register', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createFastifyInstance();
  });

  beforeEach(async () => {
    await connection.create();
  })

  afterAll(() => {
    app.close();
  });

  afterEach(async () => {
    await connection.close();
  })

  it('it should register', async () => {
    const response = await app.inject({
      method: 'post',
      url: '/register',
      payload: {
        first_name: 'ortal',
        last_name: 'yadaev',
        email: 'ortal@gmail.com',
        password: '123123',
      }
    });

    expect(response.statusCode).toBe(201);
    const userRepository = getRepository(User);
    expect(await userRepository.count()).toBe(1);
  });

  it("it shouldn't register - existing email", async () => {
    // @TODO create a user with the email `ortal@gmail.com`

    const response = await app.inject({
      method: 'post',
      url: '/register',
      payload: {
        first_name: 'ortal',
        last_name: 'yadaev',
        email: 'ortal@gmail.com',
        password: '123123',
      }
    });

    expect(response.statusCode).toBe(422);

    const userRepository = getRepository(User);
    expect(await userRepository.count()).toBe(1);
  });

  it("it shouldn't register - invalid email", async () => {
    const response = await app.inject({
      method: 'post',
      url: '/register',
      payload: {
        first_name: 'ortal',
        last_name: 'yadaev',
        email: 'invalid-email',
        password: '123123',
      }
    });

    expect(response.statusCode).toBe(201);

    const userRepository = getRepository(User);
    expect(await userRepository.count()).toBe(0);
  });
});
