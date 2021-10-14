import { BaseSeeder } from './base_seeder';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomExcluded(min: number, max: number, excluded: number): number {
  const number = Math.floor(Math.random() * (max - min) + min);

  if (number >= excluded) {
    return randomExcluded(min, max, excluded);
  }

  return number;
}

export default class PostSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const users = await User.find();

    for (let i = 0; i <= 100; i++) {
      const fromUserKey = random(0, users.length - 1);

      const toUserIndex = randomExcluded(0, users.length - 1, fromUserKey);

      await Post.factory()
        .createdBy(users[fromUserKey])
        .user(users[toUserIndex])
        .create();
    }
  }
}
