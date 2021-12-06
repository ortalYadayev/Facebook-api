import { Entity, ManyToOne, Unique } from 'typeorm';
import LikeFactory from '../database/factories/like.factory';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

@Entity('likes')
@Unique(['post', 'user', 'comment'])
export class Like extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post!: Post;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comment!: Comment | null;

  @ManyToOne(() => User, (user) => user.likes, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  static factory(): LikeFactory {
    return new LikeFactory();
  }
}
