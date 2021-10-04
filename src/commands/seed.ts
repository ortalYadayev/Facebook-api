import { createConnection } from 'typeorm';
import UserSeeder from '../database/seeders/user.seeder';

const seed = async (): Promise<void> => {
  const connection = await createConnection();

  await new UserSeeder().execute();

  await connection.close();
};

seed();
