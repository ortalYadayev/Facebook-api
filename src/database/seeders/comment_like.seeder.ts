import { BaseSeeder } from './base_seeder';
import { User } from '../../entities/user.entity';
import { Comment } from '../../entities/comment.entity';
import { CommentLike } from '../../entities/comment_like.entity';

function randomIndex(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export default class CommentLikeSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const users = await User.find();
    const comment = await Comment.find();

    for (let i = 0; i < 50; i++) {
      const fromUserKey = randomIndex(0, users.length - 1);
      const commentKey = randomIndex(0, comment.length - 1);

      await CommentLike.factory()
        .user(users[fromUserKey])
        .comment(comment[commentKey])
        .create();
    }
  }
}
