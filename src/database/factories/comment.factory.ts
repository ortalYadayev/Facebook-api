import faker from 'faker';
import { NonFunctionProperties } from './types';
import BaseFactory from './base_factory';
import { User } from '../../entities/user.entity';
import { Comment } from '../../entities/comment.entity';
import { Post } from '../../entities/post.entity';

class CommentFactory extends BaseFactory<Comment> {
  protected Entity = Comment;

  protected definition(): NonFunctionProperties<Comment> {
    return {
      content: faker.lorem.words(20),
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

export default CommentFactory;
