import { Entity, ManyToOne, Unique } from 'typeorm';
import FriendFactory from '../database/factories/friend.factory';
import BaseEntity from './BaseEntity';
import { FriendRequest } from './friend_request.entity';

@Entity('friend')
@Unique(['friendOne', 'friendTwo'])
export class Friend extends BaseEntity {
  @ManyToOne(() => FriendRequest, (friendRequest) => friendRequest.friendsOne, {
    nullable: false,
  })
  friendOne!: FriendRequest | undefined;

  @ManyToOne(() => FriendRequest, (friendRequest) => friendRequest.friendsTwo, {
    nullable: false,
  })
  friendTwo!: FriendRequest | undefined;

  static factory(): FriendFactory {
    return new FriendFactory();
  }
}
