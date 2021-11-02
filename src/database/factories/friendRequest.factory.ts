import * as faker from 'faker';
import { NonFunctionProperties } from './types';
import BaseFactory from './base_factory';
import { FriendRequest } from '../../entities/friend_request.entity';
import { User } from '../../entities/user.entity';

class FriendRequestFactory extends BaseFactory<FriendRequest> {
  protected Entity = FriendRequest;

  protected definition(): NonFunctionProperties<FriendRequest> {
    return {
      rejectedAt: null,
      deletedAt: null,
      approvedAt: faker.date.past(),
    };
  }

  sender(sender: User): this {
    return this.addToState({ sender });
  }

  receiver(receiver: User): this {
    return this.addToState({ receiver });
  }
}

export default FriendRequestFactory;
