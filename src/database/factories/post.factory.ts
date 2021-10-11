import * as faker from 'faker';
import BaseFactory from './base_factory';
import { User } from '../../entities/user.entity';
import { NonFunctionProperties } from './types';
import { Post } from '../../entities/post.entity';

class PostFactory extends BaseFactory<Post> {
  protected Entity = Post;

  protected definition(): NonFunctionProperties<Post> {
    return {
      post: faker.lorem.paragraph(4),
    };
  }

  fromUser(user: User | undefined): this {
    return this.addToState({ fromUser: user });
  }

  toUser(user: User | undefined): this {
    return this.addToState({ toUser: user });
  }
}

export default PostFactory;
