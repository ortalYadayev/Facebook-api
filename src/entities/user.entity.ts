import { AfterLoad, Column, Entity, OneToMany, Index } from 'typeorm';
import bcrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { FriendRequest } from './friend_request.entity';
import BaseEntity from './BaseEntity';
import { UrlToken } from './url_token.entity';
import UserFactory from '../database/factories/user.factory';
import { Post } from './post.entity';
import { Friend } from './friend.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';

@Entity('users')
@Index(['firstName', 'lastName'], { fulltext: true })
export class User extends BaseEntity {
  @Column({ length: 50 })
  firstName!: string;

  @Column({ length: 50 })
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true, length: 20 })
  username!: string;

  @Column()
  password!: string;

  @Column({ type: 'datetime', nullable: true })
  verifiedAt!: Date | null;

  @Column({ type: 'varchar', nullable: true })
  profilePicturePath!: string | null;

  profilePictureUrl!: string | null;

  @OneToMany(() => UrlToken, (urlToken) => urlToken.user, {
    cascade: true,
  })
  urlTokens!: UrlToken[];

  @OneToMany(() => Post, (post) => post.user, {
    cascade: true,
  })
  posts!: Post[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender, {
    cascade: true,
  })
  sentFriendRequests!: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver, {
    cascade: true,
  })
  receivedFriendRequests!: FriendRequest[];

  @OneToMany(() => Friend, (friend) => friend.sender, {
    cascade: true,
  })
  sentFriends!: Friend[];

  @OneToMany(() => Friend, (friend) => friend.receiver, {
    cascade: true,
  })
  receivedFriends!: Friend[];

  @OneToMany(() => Friend, (friend) => friend.deletedBy, {
    cascade: true,
  })
  deletedFriends!: Friend[];

  @OneToMany(() => Like, (like) => like.user, {
    cascade: true,
  })
  likes!: Like[];

  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: true,
  })
  postComments!: Comment[];

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
    this.profilePictureUrl = this.profilePicturePath;

    if (
      this.profilePicturePath &&
      !this.profilePicturePath.startsWith('http')
    ) {
      this.profilePictureUrl = `${process.env.APP_URL}/${this.profilePictureUrl}`;
    }
  }

  toJSON(): Partial<User> {
    const user = classToPlain(this);

    delete user.password;
    delete user.urlTokens;

    return JSON.parse(JSON.stringify(user));
  }
}
