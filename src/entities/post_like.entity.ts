import { Entity, ManyToOne, Unique } from 'typeorm';
import PostLikeFactory from '../database/factories/post_like.factory';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('post_likes')
@Unique(['post', 'user'])
export class PostLike extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.postLikes, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post!: Post;

  @ManyToOne(() => User, (user) => user.postLikes, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  static factory(): PostLikeFactory {
    return new PostLikeFactory();
  }
}
