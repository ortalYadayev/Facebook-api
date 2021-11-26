import * as faker from 'faker';
import { NonFunctionProperties } from './types';
import BaseFactory from './base_factory';
import { User } from '../../entities/user.entity';
import { Like } from '../../entities/like.entity';
import { Post } from '../../entities/post.entity';

class LikeFactory extends BaseFactory<Like> {
  protected Entity = Like;

  protected definition(): NonFunctionProperties<Like> {
    return {};
  }

  user(user: User): this {
    return this.addToState({ user });
  }

  post(post: Post): this {
    return this.addToState({ post });
  }
}

export default LikeFactory;
