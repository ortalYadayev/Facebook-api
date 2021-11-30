import { createConnection } from 'typeorm';
import FriendRequestSeeder from '../database/seeders/friendRequest.seeder';
import FriendSeeder from '../database/seeders/friend.seeder';
import PostSeeder from '../database/seeders/post.seeder';
import UserSeeder from '../database/seeders/user.seeder';
import LikeSeeder from '../database/seeders/like.seeder';

const seed = async (): Promise<void> => {
  const connection = await createConnection();

  await new UserSeeder().execute();
  await new PostSeeder().execute();
  await new FriendRequestSeeder().execute();
  await new FriendSeeder().execute();
  await new LikeSeeder().execute();

  await connection.close();
};

seed();
