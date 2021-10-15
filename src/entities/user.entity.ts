import { AfterLoad, Column, Entity, OneToMany } from 'typeorm';
import bcrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import BaseEntity from './BaseEntity';
import { UrlToken } from './url_token.entity';
import UserFactory from '../database/factories/user.factory';
import { StorePost } from './storePost.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 50 })
  firstName!: string;

  @Column({ length: 50 })
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true, length: 20 })
  username!: string;

  @Column({ select: false })
  password!: string;

  @Column({ type: 'datetime', nullable: true })
  verifiedAt!: Date | null;

  @Column({ nullable: true })
  profilePicturePath!: string;

  profilePictureUrl!: string | undefined;

  @OneToMany(() => UrlToken, (urlToken) => urlToken.user)
  urlTokens!: UrlToken[];

  @OneToMany(() => StorePost, (storePost) => storePost.createdBy)
  posts!: StorePost[];

  @OneToMany(() => StorePost, (storePost) => storePost.user)
  relatedPosts!: StorePost[];

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

  @AfterLoad()
  setComputedProperties(): void {
    if (!this.profilePicturePath) {
      this.profilePictureUrl = undefined;
    } else {
      // check if is url
      this.profilePictureUrl = `${process.env.APP_URL}/${this.profilePicturePath}`;
    }
  }

  toJSON(): Partial<User> {
    const user = classToPlain(this);

    delete user.id;
    delete user.password;
    delete user.urlTokens;

    return JSON.parse(JSON.stringify(user));
  }
}
