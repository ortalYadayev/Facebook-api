import { User } from '../../entities/user.entity';
import { BaseSeeder } from './base_seeder';

export default class UserSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    await User.factory().defaultImageUrl().createMany(100);
  }
}
