import {assert} from 'chai';
import 'mocha';
import {User} from "../../src/models/User";
import {Connection, createConnection, getRepository} from "typeorm";
import {UserEntity} from "../../src/entities/UserEntity";
import {FastifyInstance} from "fastify";
import {connection} from "../helpers/connection";
import {createFastifyInstance} from "../../src/app";

describe('Register', async () => {
  let app: FastifyInstance<any>;

  before(async () => {
    app = await createFastifyInstance();
  });

  beforeEach(async () => {
    await connection.create();
  })

  after(() => {
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

    assert.equal(response.statusCode, 201);
    const userRepository = getRepository<User>(UserEntity);
    assert.equal(await userRepository.count(), 1);
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

    assert.equal(response.statusCode, 422);

    const userRepository = getRepository<User>(UserEntity);
    assert.equal(await userRepository.count(), 1);
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

    assert.equal(response.statusCode, 201);

    const userRepository = getRepository<User>(UserEntity);
    assert.equal(await userRepository.count(), 0);
  });
});
