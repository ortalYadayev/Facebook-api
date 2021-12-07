import { NonFunctionProperties } from './types';
import BaseFactory from './base_factory';
import { User } from '../../entities/user.entity';
import { PostLike } from '../../entities/post_like.entity';
import { Post } from '../../entities/post.entity';

class PostLikeFactory extends BaseFactory<PostLike> {
  protected Entity = PostLike;

  protected definition(): NonFunctionProperties<PostLike> {
    return {};
  }

  user(user: User): this {
    return this.addToState({ user });
  }

  post(post: Post): this {
    return this.addToState({ post });
  }
}

export default PostLikeFactory;
