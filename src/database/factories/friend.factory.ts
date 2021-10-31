import { FriendRequest } from '../../entities/friend_request.entity';
import { NonFunctionProperties } from './types';
import BaseFactory from './base_factory';
import { Friend } from '../../entities/friend.entity';

class FriendFactory extends BaseFactory<Friend> {
  protected Entity = Friend;

  protected definition(): NonFunctionProperties<Friend> {
    return {};
  }

  friendOne(friendOne: FriendRequest): this {
    return this.addToState({ friendOne });
  }

  friendTwo(friendTwo: FriendRequest): this {
    return this.addToState({ friendTwo });
  }
}

export default FriendFactory;
