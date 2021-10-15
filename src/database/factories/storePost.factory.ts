import * as faker from 'faker';
import BaseFactory from './base_factory';
import { User } from '../../entities/user.entity';
import { NonFunctionProperties } from './types';
import { StorePost } from '../../entities/storePost.entity';

class StorePostFactory extends BaseFactory<StorePost> {
  protected Entity = StorePost;

  protected definition(): NonFunctionProperties<StorePost> {
    return {
      content: faker.lorem.words(10),
    };
  }

  createdBy(user: User): this {
    return this.addToState({ createdBy: user });
  }

  user(user: User): this {
    return this.addToState({ user });
  }
}

export default StorePostFactory;
