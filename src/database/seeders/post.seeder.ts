import { BaseSeeder } from './base_seeder';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';

function randomIndex(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export default class PostSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const users = await User.find();

    for (let i = 0; i < 100; i++) {
      const fromUserKey = randomIndex(1, users.length - 1);

      await Post.factory().user(users[fromUserKey]).create();
    }
  }
}
