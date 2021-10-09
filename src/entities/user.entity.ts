import { Column, Entity, OneToMany } from 'typeorm';
import bcrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import BaseEntity from './BaseEntity';
import { UrlToken } from './url_token.entity';
import UserFactory from '../database/factories/user.factory';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ select: false })
  password!: string;

  @Column({ type: 'datetime', nullable: true })
  verifiedAt!: Date | null;

  @Column({ nullable: true })
  imageUrl!: string;

  @OneToMany(() => UrlToken, (urlToken) => urlToken.user)
  urlTokens!: UrlToken[];

  static factory(): UserFactory {
    return new UserFactory();
  }

  static hashPassword(password: string): string {
    return bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT_ROUNDS || '12')),
    );
  }

  static comparePasswords(
    password: string,
    encryptedPassword: string,
  ): boolean {
    return bcrypt.compareSync(password, encryptedPassword);
  }

  getImageUrlAttribute(): void {
    let { imageUrl } = this;

    if (!imageUrl) {
      imageUrl = '/storage/assets/images/user.png';
    }

    this.imageUrl = process.env.APP_URL + imageUrl;
  }

  toJSON(): Partial<User> {
    this.getImageUrlAttribute();

    const user = classToPlain(this);

    delete user.password;
    delete user.urlTokens;

    return JSON.parse(JSON.stringify(user));
  }
}
