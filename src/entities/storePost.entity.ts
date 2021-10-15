import { Column, Entity, ManyToOne } from 'typeorm';
import StorePostFactory from '../database/factories/storePost.factory';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';

@Entity('store_posts')
export class StorePost extends BaseEntity {
  @Column()
  content!: string;

  @ManyToOne(() => User, (user) => user.relatedPosts, { nullable: false })
  user!: User | undefined;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  createdBy!: User | undefined;

  static factory(): StorePostFactory {
    return new StorePostFactory();
  }
}
