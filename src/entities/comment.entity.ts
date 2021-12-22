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

  @ManyToOne(() => User, (user) => user.comments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post!: Post;

  @ManyToOne(() => Comment, (comment) => comment.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comment!: Comment;

  @OneToMany(() => Comment, (comment) => comment.comment, {
    cascade: true,
  })
  comments!: Comment[];

  @OneToMany(() => Like, (likes) => likes.comment, {
    cascade: true,
  })
  likes!: Like[];

  static factory(): CommentFactory {
    return new CommentFactory();
  }
}
