import { MigrationInterface, QueryRunner } from 'typeorm';

export class UrlTokenTypeToEnum1629397185473 implements MigrationInterface {
  name = 'UrlTokenTypeToEnum1629397185473';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`url_tokens\` DROP COLUMN \`type\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`url_tokens\`
            ADD \`type\` enum ('email_verification') NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`url_tokens\` DROP COLUMN \`type\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`url_tokens\`
            ADD \`type\` varchar(255) NOT NULL
        `);
  }
}
