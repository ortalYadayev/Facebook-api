import {User} from "../../entities/user.entity";
import * as faker from "faker";
import { EntityProperties } from "./types";
import { BaseFactory } from "./base-factory";

export class UserFactory extends BaseFactory<User>
{
  definition(): EntityProperties<User>
  {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      verifiedAt: faker.date.past(),
      urlTokens: []
    }
  }

  create(overrideParameters?: EntityProperties<User>): Promise<User>
  {
    return User.create({
      ...this.definition(),
      ...overrideParameters,
    }).save();
  }
}
