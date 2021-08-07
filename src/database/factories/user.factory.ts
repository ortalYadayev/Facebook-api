import {define} from "typeorm-seeding";
import {User} from "../../entities/user.entity";
import Faker from 'faker';

define(User, (faker: typeof Faker, context: Object) => {
  return User.create({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...context,
  });
})
