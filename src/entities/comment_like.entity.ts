import { Entity, ManyToOne, Unique } from 'typeorm';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import CommentLikeFactory from '../database/factories/comment_like.factory';

@Entity('comment_likes')
@Unique(['comment', 'user'])
export class CommentLike extends BaseEntity {
  @ManyToOne(() => Comment, (comment) => comment.commentLikes, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comment!: Comment;

  @ManyToOne(() => User, (user) => user.commentLikes, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  static factory(): CommentLikeFactory {
    return new CommentLikeFactory();
  }
}
