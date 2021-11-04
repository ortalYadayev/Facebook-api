import * as faker from 'faker';
import { FriendRequest } from '../../entities/friend_request.entity';
import { NonFunctionProperties } from './types';
import BaseFactory from './base_factory';
import { Friend } from '../../entities/friend.entity';
import { User } from '../../entities/user.entity';

class FriendFactory extends BaseFactory<Friend> {
  protected Entity = Friend;

  protected definition(): NonFunctionProperties<Friend> {
    return {};
  }

  sender(sender: User): this {
    return this.addToState({ sender });
  }

  receiver(receiver: User): this {
    return this.addToState({ receiver });
  }

  request(request: FriendRequest): this {
    return this.addToState({ request });
  }

  deletedBy(user: User): this {
    return this.addToState({
      deletedBy: user,
      deletedAt: faker.date.past(),
    });
  }
}

export default FriendFactory;
