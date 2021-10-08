import * as faker from 'faker';
import { User } from '../../entities/user.entity';
import BaseFactory from './base_factory';
import { NonFunctionProperties } from './types';

class UserFactory extends BaseFactory<User> {
  protected Entity = User;

  protected definition(): NonFunctionProperties<User> {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.unique(faker.internet.email),
      username: faker.unique(faker.internet.userName),
      password: faker.internet.password(),
      verifiedAt: faker.date.past(),
      imageUrl: faker.image.people(40, 40),
      urlTokens: [],
    };
  }

  protected beforeCreate(
    parameters: NonFunctionProperties<User>,
  ): NonFunctionProperties<User> {
    parameters.password = User.hashPassword(parameters.password as string);

    return parameters;
  }

  unverified(): this {
    return this.addToState({
      verifiedAt: null,
    });
  }

  defaultImageUrl(): this {
    return this.addToState({
      imageUrl: undefined,
    });
  }
}

export default UserFactory;
