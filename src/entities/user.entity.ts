import {Column, Entity, OneToMany} from "typeorm";
import {BaseEntity} from "./BaseEntity";
import {UserVerification} from "./user_verification.entity";

@Entity('users')
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column({nullable: true, default: null})
  verifiedAt: Date | null;

  @OneToMany(() => UserVerification, userVerification => userVerification.user)
  verifications: UserVerification[];
}
