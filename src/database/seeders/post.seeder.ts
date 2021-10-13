import { BaseSeeder } from './base_seeder';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';

function randomExcluded(min, max, excluded) {
  let n = Math.floor(Math.random() * (max - min) + min);
  if (n >= excluded) n++;
  return n;
}

export default class PostSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const users = await User.find();

    for (let i = 0; i <= 100; i++) {
      const fromUser = randomExcluded(1, 19, 0);

      const toUser = randomExcluded(1, 19, fromUser);

      const twoUsers = users.filter(
        (user) => user.id === fromUser || user.id === toUser,
      );

      if (!twoUsers[1]) return;
      await Post.factory().createdBy(twoUsers[0]).user(twoUsers[1]).create();
    }
  }
}
