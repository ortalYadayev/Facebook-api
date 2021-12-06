import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';
import { Post } from './post.entity';
import CommentFactory from '../database/factories/comment.factory';
import { Like } from './like.entity';

@Entity('comments')
export class Comment extends BaseEntity {
  @Column()
  content!: string;

  @ManyToOne(() => Post, (post) => post.comments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post!: Post;

  @ManyToOne(() => User, (user) => user.postComments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  @OneToMany(() => Like, (like) => like.comment, {
    cascade: true,
  })
  likes!: Like[];

  static factory(): CommentFactory {
    return new CommentFactory();
  }
}
