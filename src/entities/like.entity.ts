import { Entity, ManyToOne, Unique } from 'typeorm';
import LikeFactory from '../database/factories/like.factory';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('likes')
@Unique(['post', 'user'])
export class Like extends BaseEntity {
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

  static factory(): LikeFactory {
    return new LikeFactory();
  }
}
