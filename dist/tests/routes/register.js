import { createApp } from "../../src/app.js";
import { assert } from 'chai';
import 'mocha';
import { User } from "../../src/entities/User.js";
import { getRepository } from "typeorm";
describe('Register', async () => {
    const app = await createApp();
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
        const userRepository = getRepository(User);
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
        // @TODO assert that user isn't created
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
        // @TODO assert that user isn't created
    });
});
