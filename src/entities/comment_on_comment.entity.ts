import { Column, Entity, ManyToOne } from 'typeorm';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import CommentOnCommentFactory from '../database/factories/comment_on_comment.factory';

@Entity('comment_on_comments')
export class CommentOnComment extends BaseEntity {
  @Column()
  content!: string;

  @ManyToOne(() => Comment, (comment) => comment.commentOnComments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comment!: Comment;

  @ManyToOne(() => User, (user) => user.commentOnComments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  // @OneToMany(() => CommentLike, (commentLike) => commentLike.comment, {
  //   cascade: true,
  // })
  // commentLikes!: CommentLike[];

  static factory(): CommentOnCommentFactory {
    return new CommentOnCommentFactory();
  }
}
