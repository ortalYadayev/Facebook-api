import faker from 'faker';
import { Post } from '../../entities/post.entity';
import { BaseSeeder } from './base_seeder';
import { User } from '../../entities/user.entity';

export default class PostSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    await Post.factory()
      .fromUser(
        await User.findOne({
          where: { id: faker.random.number(100) },
        }),
      )
      .toUser(
        await User.findOne({
          where: { id: faker.random.number(100) },
        }),
      )
      .createMany(100);
  }
}
