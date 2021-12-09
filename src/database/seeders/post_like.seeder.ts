import { BaseSeeder } from './base_seeder';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';
import { Like } from '../../entities/like.entity';

function randomIndex(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export default class PostLikeSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const users = await User.find();
    const posts = await Post.find();
    const postLikes = await Like.find({
      where: {
        comment: null,
      },
    });

    const postLikesMap = new Map();

    postLikes.forEach((like) => postLikesMap.set(like.post.id, like.user.id));

    for (let i = 0; i < 50; i++) {
      const fromUserKey = randomIndex(0, users.length - 1);
      let postKey = randomIndex(0, posts.length - 1);

      while (
        postLikesMap.get(postKey) === fromUserKey ||
        postLikesMap.get(fromUserKey) === postKey ||
        postKey === fromUserKey
      ) {
        postKey++;
      }
      postLikesMap.set(postKey, fromUserKey);

      await Like.factory()
        .user(users[fromUserKey])
        .post(posts[postKey])
        .create();
    }
  }
}
