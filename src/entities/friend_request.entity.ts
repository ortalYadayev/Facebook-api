import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Friend } from './friend.entity';
import FriendRequestFactory from '../database/factories/friendRequest.factory';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';

@Entity('friend_requests')
export class FriendRequest extends BaseEntity {
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
  rejectedAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  deletedAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  approvedAt!: Date | null;

  @OneToOne(() => Friend, (friend) => friend.request, {
    nullable: true,
    cascade: true,
  })
  friend!: Friend | null;

  static factory(): FriendRequestFactory {
    return new FriendRequestFactory();
  }
}
