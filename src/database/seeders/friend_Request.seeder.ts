import {
  FriendRequest,
  FriendRequestEnum,
} from '../../entities/friend_request.entity';
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

export default class FriendRequestSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const users = await User.find();

    for (let i = 0; i <= 50; i++) {
      const userOneIndex = randomIndex(0, users.length - 1);

      const userTwoIndex = randomExcluded(0, users.length - 1, userOneIndex);

      await FriendRequest.factory()
        .status(FriendRequestEnum.SENT_REQUEST)
        .userOne(users[userOneIndex])
        .userTwo(users[userTwoIndex])
        .create();
    }
  }
}
