import { NonFunctionProperties } from './types';
import BaseFactory from './base_factory';
import { Friend, FriendEnum } from '../../entities/friend.entity';
import { User } from '../../entities/user.entity';

class FriendFactory extends BaseFactory<Friend> {
  protected Entity = Friend;

  protected definition(): NonFunctionProperties<Friend> {
    return {};
  }

  status(status: FriendEnum): this {
    return this.addToState({ status });
  }

  sender(sender: User): this {
    return this.addToState({ sender });
  }

  receiver(receiver: User): this {
    return this.addToState({ receiver });
  }
}

export default FriendFactory;
