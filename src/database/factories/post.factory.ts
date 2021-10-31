import * as faker from 'faker';
import BaseFactory from './base_factory';
import { User } from '../../entities/user.entity';
import { NonFunctionProperties } from './types';
import { Post } from '../../entities/post.entity';

class PostFactory extends BaseFactory<Post> {
  protected Entity = Post;

  protected definition(): NonFunctionProperties<Post> {
    return {
      content: faker.lorem.words(10),
    };
  }

  user(user: User): this {
    return this.addToState({ user });
  }
}

export default PostFactory;
