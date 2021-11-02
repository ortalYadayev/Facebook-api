import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
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
    cascade: true,
  })
  sender!: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests, {
    nullable: false,
    cascade: true,
  })
  receiver!: User;

  @Column({ type: 'datetime', nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => User, (user) => user.deletedFriends, {
    nullable: true,
    cascade: true,
  })
  deletedBy!: User | null;

  @OneToOne(
    () => FriendRequest,
    (friendRequest) => friendRequest.friendApproved,
    {
      nullable: false,
      cascade: true,
    },
  )
  request!: FriendRequest;

  static factory(): FriendFactory {
    return new FriendFactory();
  }
}
