import * as faker from 'faker';
import { User } from '../../entities/user.entity';
import BaseFactory from './base_factory';
import { NonFunctionProperties } from './types';

class UserFactory extends BaseFactory<User> {
  protected Entity = User;

  protected definition(): NonFunctionProperties<User> {
    return {
      firstName: faker.name.firstName(50),
      lastName: faker.name.lastName(50),
      email: faker.unique(faker.internet.email),
      username: faker.unique(faker.internet.userName).substring(0, 20),
      profilePicturePath: faker.internet.avatar(),
      password: faker.internet.password(),
      verifiedAt: faker.date.past(),
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

  ProfilePicture(picture: string): this {
    return this.addToState({
      profilePicturePath: picture,
    });
  }
}

export default UserFactory;
