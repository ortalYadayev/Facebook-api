import { FriendRequest } from '../../entities/friend_request.entity';
import { BaseSeeder } from './base_seeder';
import { Friend } from '../../entities/friend.entity';

function randomIndex(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export default class FriendSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const friendRequests = await FriendRequest.find({
      relations: ['sender', 'receiver'],
    });

    for (let i = 0; i < 20; i++) {
      let friendRequestIndex = randomIndex(0, friendRequests.length - 1);

      while (friendRequests[friendRequestIndex].approvedAt !== null) {
        friendRequestIndex++;
      }

      const friend = await Friend.factory()
        .sender(friendRequests[friendRequestIndex].sender)
        .receiver(friendRequests[friendRequestIndex].receiver)
        .request(friendRequests[friendRequestIndex])
        .create();

      friendRequests[friendRequestIndex].approvedAt = friend.createdAt;
      await friendRequests[friendRequestIndex].save();
    }
  }
}
