import { BaseSeeder } from './base_seeder';
import { User } from '../../entities/user.entity';
import { StorePost } from '../../entities/storePost.entity';

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomExcluded(min: number, max: number, excluded: number): number {
  let number = Math.floor(Math.random() * (max - min) + min);

  if (number === excluded) {
    number++;
  }

  return number;
}

export default class StorePostSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const users = await User.find();

    for (let i = 0; i <= 100; i++) {
      const fromUserKey = random(1, users.length - 1);

      const toUserIndex = randomExcluded(1, users.length - 1, fromUserKey);

      try {
        await StorePost.factory()
          .createdBy(users[fromUserKey])
          .user(users[toUserIndex])
          .create();
      } catch (error) {
        console.log(error);
      }
    }
  }
}
