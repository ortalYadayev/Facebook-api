import { Column, Entity, ManyToOne, JoinTable, Unique } from 'typeorm';
import FriendFactory from '../database/factories/friend.factory';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';

export enum FriendEnum {
  PENDING = 'pending',
  REJECTED = 'rejected',
  APPROVED = 'approved',
  DELETED = 'deleted',
}

@Entity('friend_request')
@Unique(['sender', 'receiver'])
export class Friend extends BaseEntity {
  @Column({ type: 'simple-enum', enum: FriendEnum })
  status!: FriendEnum;

  @ManyToOne(() => User, (user) => user.sentFriend, {
    nullable: false,
    cascade: true,
  })
  @JoinTable()
  sender!: User;

  @ManyToOne(() => User, (user) => user.receivedFriend, {
    nullable: false,
    cascade: true,
  })
  @JoinTable()
  receiver!: User;

  static factory(): FriendFactory {
    return new FriendFactory();
  }
}
