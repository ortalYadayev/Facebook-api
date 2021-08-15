import {define} from "typeorm-seeding";
import Faker from 'faker';
import {URLToken} from "../../entities/url_token.entity";

define(URLToken, (faker: typeof Faker, context: Object) => {
  return URLToken.create({
    token: faker.random.alphaNumeric(120),
    type: URLToken.TYPE_EMAIL_VERIFICATION,
    expiresIn: faker.date.past(),
    ...context,
  });
})
