import { BaseSeeder } from './base_seeder';
import { UrlToken } from '../../entities/url_token.entity';

export default class UrlTokenSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    await UrlToken.factory().createMany(100);
  }
}
