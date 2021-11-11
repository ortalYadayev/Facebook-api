import { Column, Entity, ManyToOne } from 'typeorm';
import PostFactory from '../database/factories/post.factory';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column()
  content!: string;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User | undefined;

  static factory(): PostFactory {
    return new PostFactory();
  }
}
