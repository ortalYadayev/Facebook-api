import {URLToken} from "../../entities/url_token.entity";
import * as faker from "faker";
import { EntityProperties } from "./types";
import { BaseFactory } from "./base-factory";

export class UrlTokenFactory extends BaseFactory<URLToken>
{
  definition(): EntityProperties<URLToken>
  {
    return {
      token: faker.random.alphaNumeric(120),
      type: URLToken.TYPE_EMAIL_VERIFICATION,
      expireAt: faker.date.future()
    }
  }

  create(overrideParameters?: EntityProperties<URLToken>): Promise<URLToken>
  {
    return URLToken.create({
      ...this.definition(),
      ...overrideParameters,
    }).save();
  }
}
