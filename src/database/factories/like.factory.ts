import { NonFunctionProperties } from './types';
import BaseFactory from './base_factory';
import { User } from '../../entities/user.entity';
import { Like } from '../../entities/like.entity';
import { Post } from '../../entities/post.entity';
import { Comment } from '../../entities/comment.entity';

class LikeFactory extends BaseFactory<Like> {
  protected Entity = Like;

  protected definition(): NonFunctionProperties<Like> {
    return {
      comment: null,
    };
  }

  user(user: User): this {
    return this.addToState({ user });
  }

  post(post: Post): this {
    return this.addToState({ post });
  }

  comment(comment: Comment): this {
    return this.addToState({ comment });
  }
}

export default LikeFactory;
