import { User } from '../../entities/user.entity';
import * as faker from 'faker';
import { BaseFactory } from './base_factory';
import { NonFunctionProperties } from './types';

export class UserFactory extends BaseFactory<User> {
  protected entity = User;

  protected definition(): NonFunctionProperties<User> {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      verifiedAt: faker.date.past(),
      urlTokens: [],
    };
  }

  unverified(): this {
    return this.addToState({
      verifiedAt: null,
    });
  }
}
