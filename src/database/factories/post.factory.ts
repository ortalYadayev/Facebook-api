import * as faker from 'faker';
import BaseFactory from './base_factory';
import { User } from '../../entities/user.entity';
import { NonFunctionProperties } from './types';
import { Post } from '../../entities/post.entity';

class PostFactory extends BaseFactory<Post> {
  protected Entity = Post;

  protected definition(): NonFunctionProperties<Post> {
    return {
      description: faker.lorem.paragraph(4),
    };
  }

  createdBy(user: User | undefined): this {
    return this.addToState({ createdBy: user });
  }

  user(user: User | undefined): this {
    return this.addToState({ user });
  }
}

export default PostFactory;
