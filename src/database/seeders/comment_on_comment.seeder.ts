import { BaseSeeder } from './base_seeder';
import { User } from '../../entities/user.entity';
import { Comment } from '../../entities/comment.entity';

function randomIndex(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export default class CommentOnCommentSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const users = await User.find();
    const comments = await Comment.find({
      where: {
        post: null,
      },
    });

    for (let i = 0; i < 20; i++) {
      const fromUserKey = randomIndex(0, users.length - 1);
      const commentKey = randomIndex(0, comments.length - 1);

      await Comment.factory()
        .user(users[fromUserKey])
        .comment(comments[commentKey])
        .create();
    }
  }
}
