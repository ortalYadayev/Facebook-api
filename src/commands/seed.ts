import { createConnection } from 'typeorm';
import UserSeeder from '../database/seeders/user.seeder';
import UrlTokenSeeder from '../database/seeders/url_token.seeder';
import PostSeeder from '../database/seeders/post.seeder';

const seed = async (): Promise<void> => {
  const connection = await createConnection();

  await new UserSeeder().execute();
  await new UrlTokenSeeder().execute();
  await new PostSeeder().execute();

  await connection.close();
};

seed();
