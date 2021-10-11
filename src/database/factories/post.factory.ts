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
      uploadDate: faker.date.recent(),
    };
  }

  userFrom(user: User | undefined): this {
    return this.addToState({ userFrom: user });
  }

  userTo(user: User | undefined): this {
    return this.addToState({ userTo: user });
  }
}

export default PostFactory;
