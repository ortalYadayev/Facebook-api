import {define} from "typeorm-seeding";
import {User} from "../../entities/user.entity";
import Faker from 'faker';

define(User, (faker: typeof Faker) => {
  const user = new User();
  user.firstName = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();
  return user;
})
