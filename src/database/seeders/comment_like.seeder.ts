import { BaseSeeder } from './base_seeder';
import { User } from '../../entities/user.entity';
import { Comment } from '../../entities/comment.entity';
import { Like } from '../../entities/like.entity';

function randomIndex(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export default class CommentLikeSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const users = await User.find();
    const comments = await Comment.find();
    const commentLikes = await Like.find({
      where: {
        post: null,
      },
    });

    const commentLikesMap = new Map();

    commentLikes.forEach((like) =>
      commentLikesMap.set(like.comment.id, like.user.id),
    );

    for (let i = 0; i < 50; i++) {
      const fromUserKey = randomIndex(0, users.length - 1);
      let commentKey = randomIndex(0, comments.length - 1);

      while (
        commentLikesMap.get(commentKey) === fromUserKey ||
        commentLikesMap.get(fromUserKey) === commentKey ||
        commentKey === fromUserKey
      ) {
        commentKey++;
      }
      commentLikesMap.set(commentKey, fromUserKey);

      await Like.factory()
        .user(users[fromUserKey])
        .comment(comments[commentKey])
        .create();
    }
  }
}
