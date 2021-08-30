import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixDateTimeColumns1629414752968 implements MigrationInterface {
  name = 'FixDateTimeColumns1629414752968';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`created_at\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`updated_at\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` DROP COLUMN \`created_at\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` DROP COLUMN \`updated_at\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\`
            ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\`
            ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` DROP COLUMN \`updatedAt\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` DROP COLUMN \`createdAt\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`updatedAt\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`createdAt\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\`
            ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\`
            ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
  }
}
