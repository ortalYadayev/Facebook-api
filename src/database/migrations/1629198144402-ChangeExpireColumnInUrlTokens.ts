import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeExpireColumnInUrlTokens1629198144402
  implements MigrationInterface
{
  name = 'ChangeExpireColumnInUrlTokens1629198144402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`url_tokens\` CHANGE \`expiresIn\` \`expireAt\` datetime NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`url_tokens\` CHANGE \`expireAt\` \`expiresIn\` datetime NULL
        `);
  }
}
