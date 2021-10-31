import { createConnection } from 'typeorm';
import PostSeeder from '../database/seeders/post.seeder';
import UserSeeder from '../database/seeders/user.seeder';
import FriendSeeder from '../database/seeders/friend.seeder';

const seed = async (): Promise<void> => {
  const connection = await createConnection();

  await new UserSeeder().execute();
  await new PostSeeder().execute();
  await new FriendSeeder().execute();

  await connection.close();
};

seed();
