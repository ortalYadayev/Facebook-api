import * as faker from 'faker';
import { User } from '../../entities/user.entity';
import BaseFactory from './base_factory';
import { NonFunctionProperties } from './types';

class UserFactory extends BaseFactory<User> {
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

  hashPassword(password: string): this {
    return this.addToState({
      password: User.hashPassword(password),
    });
  }

  unverified(): this {
    return this.addToState({
      verifiedAt: null,
    });
  }
}

export default UserFactory;
