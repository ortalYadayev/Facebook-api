import { NonFunctionProperties } from './types';
import BaseFactory from './base_factory';
import {
  FriendRequest,
  FriendRequestEnum,
} from '../../entities/friend_request.entity';
import { User } from '../../entities/user.entity';

class FriendRequestFactory extends BaseFactory<FriendRequest> {
  protected Entity = FriendRequest;

  protected definition(): NonFunctionProperties<FriendRequest> {
    return {};
  }

  status(status: FriendRequestEnum): this {
    return this.addToState({ status });
  }

  userOne(userOne: User): this {
    return this.addToState({ userOne });
  }

  userTwo(userTwo: User): this {
    return this.addToState({ userTwo });
  }
}

export default FriendRequestFactory;
