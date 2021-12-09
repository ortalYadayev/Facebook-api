import { NonFunctionProperties } from './types';
import BaseFactory from './base_factory';
import { User } from '../../entities/user.entity';
import { Like } from '../../entities/like.entity';
import { Post } from '../../entities/post.entity';
import { Comment } from '../../entities/comment.entity';

class LikeFactory extends BaseFactory<Like> {
  protected Entity = Like;

  protected definition(): NonFunctionProperties<Like> {
    return {};
  }

  user(user: User): this {
    return this.addToState({ user });
  }

  comment(comment: Comment): this {
    return this.addToState({ comment });
  }

  post(post: Post): this {
    return this.addToState({ post });
  }
}

export default LikeFactory;
