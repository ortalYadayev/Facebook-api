import { Column, Entity, ManyToOne } from 'typeorm';
import PostFactory from '../database/factories/post.factory';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column()
  post!: string;

  @ManyToOne(() => User, (user) => user.postsFrom, { nullable: false })
  fromUser!: User;

  @ManyToOne(() => User, (user) => user.postsTo, { nullable: false })
  toUser!: User;

  static factory(): PostFactory {
    return new PostFactory();
  }
}
