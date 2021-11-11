import { createConnection } from 'typeorm';
import FriendRequestSeeder from '../database/seeders/friendRequestSeeder';
import PostSeeder from '../database/seeders/post.seeder';
import UserSeeder from '../database/seeders/user.seeder';

const seed = async (): Promise<void> => {
  const connection = await createConnection();

  await new UserSeeder().execute();
  await new PostSeeder().execute();
  await new FriendRequestSeeder().execute();

  await connection.close();
};

seed();
