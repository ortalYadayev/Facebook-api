import { BaseSeeder } from './base_seeder';
import { UrlToken } from '../../entities/url_token.entity';
import { User } from '../../entities/user.entity';

export default class UrlTokenSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const users = await User.find();

    users.forEach((user: User) => UrlToken.factory().user(user).create());
  }
}
