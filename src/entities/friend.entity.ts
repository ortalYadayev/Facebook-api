import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { FriendRequest } from './friend_request.entity';
import FriendFactory from '../database/factories/friend.factory';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';

export enum FriendEnum {
  PENDING = 'pending',
  REJECTED = 'rejected',
  APPROVED = 'approved',
  DELETED = 'deleted',
}

@Entity('friends')
export class Friend extends BaseEntity {
  @ManyToOne(() => User, (user) => user.sentFriendRequests, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  sender!: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  receiver!: User;

  @Column({ type: 'datetime', nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => User, (user) => user.deletedFriends, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  deletedBy!: User | null;

  @OneToOne(() => FriendRequest, (friendRequest) => friendRequest.friend, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  request!: FriendRequest;

  static factory(): FriendFactory {
    return new FriendFactory();
  }
}
