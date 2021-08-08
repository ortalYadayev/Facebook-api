import {BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'first_name'})
  firstName: string;

  @Column({name: 'last_name'})
  lastName: string;

  @Column({unique: true})
  email: string;

  @Column({select: false})
  password: string;

  @BeforeInsert()
  async hashPassword() {
    const bcrypt = require('bcrypt');

    this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(10));
  }
}
