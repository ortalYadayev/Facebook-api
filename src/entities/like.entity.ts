import { Column, Entity, ManyToOne } from 'typeorm';
import LikeFactory from '../database/factories/like.factory';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('likes')
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

  @Column({ type: 'datetime', nullable: true })
  dislikeAt!: Date | null;

  static factory(): LikeFactory {
    return new LikeFactory();
  }
}
