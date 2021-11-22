import { FriendRequest } from '../../entities/friend_request.entity';
import { User } from '../../entities/user.entity';
import { BaseSeeder } from './base_seeder';

function randomIndex(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomExcluded(min: number, max: number, excluded: number): number {
  let number = randomIndex(min, max);

  if (number === excluded) {
    number++;
  }

  return number;
}

export default class FriendRequestSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const users = await User.find();
    const friendRequests = await FriendRequest.find({
      relations: ['sender', 'receiver'],
    });

    const friendRequestMap = new Map();

    friendRequests.forEach((friendRequest) =>
      friendRequestMap.set(friendRequest.sender.id, friendRequest.receiver.id),
    );

    for (let i = 0; i < 50; i++) {
      const senderIndex = randomIndex(0, users.length - 1);

      let receiverIndex = randomExcluded(0, users.length - 1, senderIndex);

      while (
        friendRequestMap.get(senderIndex) === receiverIndex ||
        friendRequestMap.get(receiverIndex) === senderIndex ||
        senderIndex === receiverIndex
      ) {
        receiverIndex++;
      }
      friendRequestMap.set(senderIndex, receiverIndex);

      await FriendRequest.factory()
        .sender(users[senderIndex])
        .receiver(users[receiverIndex])
        .create();
    }
  }
}
