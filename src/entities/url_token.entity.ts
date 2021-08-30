import {Column, Entity, ManyToOne} from "typeorm";
import {BaseEntity} from "./BaseEntity";
import {User} from "./user.entity";
import { v4 as uuid4 } from 'uuid';
import { UserFactory } from "../database/factories/user.factory";
import { UrlTokenFactory } from "../database/factories/url_token.factory";

export enum UrlTokenEnum {
  EMAIL_VERIFICATION = "email_verification",
}

@Entity('url_tokens')
export class UrlToken extends BaseEntity {
  @Column({
    type: "simple-enum",
    enum: UrlTokenEnum,
  })
  type!: UrlTokenEnum;

  @Column({unique: true})
  token!: string;

  @Column({type: "datetime", nullable: true})
  expireAt!: Date | null;

  @ManyToOne(() => User, user => user.urlTokens)
  user!: User;

  public static generateRandomToken() {
    return uuid4();
  }

  static factory()
  {
    return new UrlTokenFactory();
  }
}
