import faker from 'faker';
import { NonFunctionProperties } from './types';
import BaseFactory from './base_factory';
import { User } from '../../entities/user.entity';
import { CommentOnComment } from '../../entities/comment_on_comment.entity';
import { Comment } from '../../entities/comment.entity';

class CommentOnCommentFactory extends BaseFactory<CommentOnComment> {
  protected Entity = CommentOnComment;

  protected definition(): NonFunctionProperties<CommentOnComment> {
    return {
      content: faker.lorem.words(20),
    };
  }

  user(user: User): this {
    return this.addToState({ user });
  }

  comment(comment: Comment): this {
    return this.addToState({ comment });
  }
}

export default CommentOnCommentFactory;
