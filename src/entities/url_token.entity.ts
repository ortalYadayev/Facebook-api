import {Column, Entity, ManyToOne} from "typeorm";
import {BaseEntity} from "./BaseEntity";
import {User} from "./user.entity";
import { v4 as uuid4 } from 'uuid';

@Entity('url_tokens')
export class URLToken extends BaseEntity {
  public static TYPE_EMAIL_VERIFICATION = 'email_verification';

  @Column()
  type: string;

  @Column({unique: true})
  token: string;

  @Column({nullable: true})
  expiresIn: Date | null;

  @ManyToOne(() => User, user => user.verifications)
  user: User;

  public static generateRandomToken() {
    return uuid4();
  }
}
