import * as faker from 'faker';
import { NonFunctionProperties } from './types';
import BaseFactory from './base_factory';
import { FriendRequest } from '../../entities/friend_request.entity';
import { User } from '../../entities/user.entity';

class FriendRequestFactory extends BaseFactory<FriendRequest> {
  protected Entity = FriendRequest;

  protected definition(): NonFunctionProperties<FriendRequest> {
    return {};
  }

  sender(sender: User): this {
    return this.addToState({ sender });
  }

  receiver(receiver: User): this {
    return this.addToState({ receiver });
  }

  approved(): this {
    return this.addToState({ approvedAt: faker.date.past() });
  }

  deleted(): this {
    return this.addToState({ deletedAt: faker.date.past() });
  }

  rejected(): this {
    return this.addToState({ rejectedAt: faker.date.past() });
  }
}

export default FriendRequestFactory;
