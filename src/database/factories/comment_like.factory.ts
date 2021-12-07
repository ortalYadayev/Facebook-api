import { NonFunctionProperties } from './types';
import BaseFactory from './base_factory';
import { User } from '../../entities/user.entity';
import { Comment } from '../../entities/comment.entity';
import { CommentLike } from '../../entities/comment_like.entity';

class CommentLikeFactory extends BaseFactory<CommentLike> {
  protected Entity = CommentLike;

  protected definition(): NonFunctionProperties<CommentLike> {
    return {};
  }

  user(user: User): this {
    return this.addToState({ user });
  }

  comment(comment: Comment): this {
    return this.addToState({ comment });
  }
}

export default CommentLikeFactory;
