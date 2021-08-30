import {Column, Entity, OneToMany} from "typeorm";
import {BaseEntity} from "./BaseEntity";
import {UrlToken} from "./url_token.entity";
import { UserFactory } from "../database/factories/user.factory";

@Entity('users')
export class User extends BaseEntity {
  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({unique: true})
  email!: string;

  @Column()
  password!: string;

  @Column({type: "datetime", nullable: true})
  verifiedAt!: Date | null;

  @OneToMany(() => UrlToken, urlToken => urlToken.user)
  urlTokens!: UrlToken[];

  static factory()
  {
    return new UserFactory();
  }
}
