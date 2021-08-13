import {Column, Entity, ManyToOne} from "typeorm";
import {BaseEntity} from "./BaseEntity";
import {User} from "./user.entity";

@Entity('user_verifications')
export class UserVerification extends BaseEntity {
  @Column({unique: true})
  token: string;

  @ManyToOne(type => User, user => user.verifications, {nullable: false})
  user: User;
}
