import {Column, Entity, ManyToOne} from "typeorm";
import {BaseEntity} from "./BaseEntity";
import {User} from "./user.entity";
import { v4 as uuid4 } from 'uuid';
import { UserFactory } from "../database/factories/user.factory";
import { UrlTokenFactory } from "../database/factories/url_token.factory";

@Entity('url_tokens')
export class URLToken extends BaseEntity {
  public static TYPE_EMAIL_VERIFICATION = 'email_verification';

  @Column()
  type: string;

  @Column({unique: true})
  token: string;

  @Column({nullable: true})
  expireAt: Date | null;

  @ManyToOne(() => User, user => user.urlTokens)
  user: User;

  public static generateRandomToken() {
    return uuid4();
  }

  static factory()
  {
    return new UrlTokenFactory();
  }
}
