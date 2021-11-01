import { Friend, FriendEnum } from '../../entities/friend.entity';
import { User } from '../../entities/user.entity';
import { BaseSeeder } from './base_seeder';

function randomIndex(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomExcluded(min: number, max: number, excluded: number): number {
  let number = Math.floor(Math.random() * (max - min) + min);

  if (number === excluded) {
    number++;
  }

  return number;
}

export default class FriendSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const users = await User.find();

    for (let i = 0; i <= 50; i++) {
      const senderIndex = randomIndex(0, users.length - 1);

      const receiverIndex = randomExcluded(0, users.length - 1, senderIndex);

      await Friend.factory()
        .status(FriendEnum.APPROVED)
        .sender(users[senderIndex])
        .receiver(users[receiverIndex])
        .create();
    }
  }
}
