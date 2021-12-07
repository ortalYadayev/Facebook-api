import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';
import { Post } from './post.entity';
import CommentFactory from '../database/factories/comment.factory';
import { CommentLike } from './comment_like.entity';
import { CommentOnComment } from './comment_on_comment.entity';

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

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment, {
    cascade: true,
  })
  commentLikes!: CommentLike[];

  @OneToMany(
    () => CommentOnComment,
    (commentOnComment) => commentOnComment.comment,
    {
      cascade: true,
    },
  )
  commentOnComments!: CommentOnComment[];

  static factory(): CommentFactory {
    return new CommentFactory();
  }
}
