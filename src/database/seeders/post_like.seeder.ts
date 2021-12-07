import { BaseSeeder } from './base_seeder';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';
import { PostLike } from '../../entities/post_like.entity';

function randomIndex(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export default class PostLikeSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const users = await User.find();
    const posts = await Post.find();

    for (let i = 0; i < 50; i++) {
      const fromUserKey = randomIndex(0, users.length - 1);
      const postKey = randomIndex(0, posts.length - 1);

      await PostLike.factory()
        .user(users[fromUserKey])
        .post(posts[postKey])
        .create();
    }
  }
}
