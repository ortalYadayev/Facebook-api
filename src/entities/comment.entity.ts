import { Column, Entity, ManyToOne } from 'typeorm';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';
import { Post } from './post.entity';
import CommentFactory from '../database/factories/comment.factory';

@Entity('comments')
export class Comment extends BaseEntity {
  @Column()
  content!: string;

  @ManyToOne(() => Post, (post) => post.likes, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post!: Post;

  @ManyToOne(() => User, (user) => user.likes, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  static factory(): CommentFactory {
    return new CommentFactory();
  }
}
