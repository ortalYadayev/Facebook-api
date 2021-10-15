import { createConnection } from 'typeorm';
import StorePostSeeder from '../database/seeders/storePost.seeder';
import UserSeeder from '../database/seeders/user.seeder';

const seed = async (): Promise<void> => {
  const connection = await createConnection();

  await new UserSeeder().execute();
  await new StorePostSeeder().execute();

  await connection.close();
};

seed();
