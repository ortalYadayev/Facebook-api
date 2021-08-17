import {User} from "../../src/entities/user.entity";
import {FastifyInstance} from "fastify";
import {createFastifyInstance} from "../../src/createFastifyInstance";
import {factory, useSeeding} from "typeorm-seeding";
import {createConnection, getConnection} from "typeorm";
import bcrypt from 'bcrypt';
// @ts-ignore
import {mock} from "nodemailer";

describe('Register', () => {
  let app: FastifyInstance;

  beforeAll(() => {
    return createFastifyInstance().then((fastifyApp)=>{
      app = fastifyApp;
    });
  });

  beforeEach(() => {
    return Promise.all([createConnection(), useSeeding()]);
  })

  afterEach(() => {
    return getConnection().close();
  })

  afterAll(() => {
    return app.close();
  });

  it('should register', async () => {
    const response = await app.inject({
      method: 'post',
      url: '/register',
      payload: {
        firstName: 'Ortal',
        lastName: 'Yadaev',
        email: 'ortal@gmail.com',
        password: 'password',
      }
    });

    expect(response.statusCode).toBe(201);

    expect(await User.count()).toBe(1);

    const user = await User.findOne({
      where: {
        firstName: 'Ortal',
        lastName: 'Yadaev',
        email: 'ortal@gmail.com',
      },
    });

    expect(user).toBeInstanceOf(User);

    expect(await bcrypt.compare('password', user.password)).toBeTruthy();

    const sentEmails = mock.getSentMail();
    expect(sentEmails.length).toBe(1);
    expect(sentEmails[0].to).toBe(user.email);

    expect(user.verifiedAt).toBeNull();
  });

  it("shouldn't register - existing email", async () => {
    await factory(User)().create({
      email: 'ortal@gmail.com'
    });

    const response = await app.inject({
      method: 'post',
      url: '/register',
      payload: {
        firstName: 'Ortal',
        lastName: 'Yadaev',
        email: 'ortal@gmail.com',
        password: 'password',
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
        firstName: 'Ortal',
        lastName: 'Yadaev',
        email: 'invalid-email',
        password: 'password',
      }
    });

    expect(response.statusCode).toBe(400);

    expect(await User.count()).toBe(0);
  });

  it("shouldn't register - existing unverified user - should resend verification email", async () => {
    await factory(User)().create({
      email: 'ortal@gmail.com'
    });

    const response = await app.inject({
      method: 'post',
      url: '/register',
      payload: {
        firstName: 'Ortal',
        lastName: 'Yadaev',
        email: 'ortal@gmail.com',
        password: 'password',
      }
    });

    expect(response.statusCode).toBe(422);

    expect(await User.count()).toBe(1);

    // @TODO assert that email verification is sent
  });
});

