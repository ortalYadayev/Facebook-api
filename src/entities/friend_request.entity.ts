import {
  Column,
  Entity,
  ManyToOne,
  JoinTable,
  OneToMany,
  Unique,
} from 'typeorm';
import FriendRequestFactory from '../database/factories/friend_request.factory';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';
import { Friend } from './friend.entity';

export enum FriendRequestEnum {
  SENT_REQUEST = 'sent_request',
  ACCEPTED_REQUEST = 'accepted_request',
}

@Entity('friend_request')
@Unique(['userOne', 'userTwo'])
export class FriendRequest extends BaseEntity {
  @Column({ type: 'enum', enum: FriendRequestEnum })
  status!: FriendRequestEnum;

  @ManyToOne(() => User, (user) => user.requestsOne, {
    nullable: false,
    cascade: true,
  })
  @JoinTable()
  userOne!: User | undefined;

  @ManyToOne(() => User, (user) => user.requestsTwo, {
    nullable: false,
    cascade: true,
  })
  @JoinTable()
  userTwo!: User | undefined;

  @OneToMany(() => Friend, (friend) => friend.friendOne)
  friendsOne!: Friend[];

  @OneToMany(() => Friend, (friend) => friend.friendTwo)
  friendsTwo!: Friend[];

  static factory(): FriendRequestFactory {
    return new FriendRequestFactory();
  }
}
