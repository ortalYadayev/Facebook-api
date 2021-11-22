import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { FriendRequest } from './friend_request.entity';
import FriendFactory from '../database/factories/friend.factory';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';

@Entity('friends')
export class Friend extends BaseEntity {
  @ManyToOne(() => User, (user) => user.sentFriendRequests, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sender!: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  receiver!: User;

  @Column({ type: 'datetime', nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => User, (user) => user.deletedFriends, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  deletedBy!: User | null;

  @OneToOne(() => FriendRequest, (friendRequest) => friendRequest.friend, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  request!: FriendRequest;

  static factory(): FriendFactory {
    return new FriendFactory();
  }
}
