import {User} from "../../src/entities/user.entity";
import {FastifyInstance} from "fastify";
import {createFastifyInstance} from "../../src/createFastifyInstance";
import {createConnection, getConnection} from "typeorm";
import bcrypt from 'bcrypt';
// @ts-ignore
import {mock as nodemailerMock} from "nodemailer";

describe('Register', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createFastifyInstance();
  });

  beforeEach(async () => {
    await createConnection();
    nodemailerMock.reset();
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

    const sentEmails = nodemailerMock.getSentMail();
    expect(sentEmails.length).toBe(1);
    expect(sentEmails[0].to).toBe(user.email);

    expect(user.verifiedAt).toBeNull();
  });

  it("shouldn't register - existing email", async () => {
    await User.factory().create({
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
    await User.factory().unverified().create({
      email: 'ortal@gmail.com',
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

    const sentEmails = nodemailerMock.getSentMail();
    expect(sentEmails.length).toBe(1);
    expect(sentEmails[0].to).toBe('ortal@gmail.com');
  });
});

