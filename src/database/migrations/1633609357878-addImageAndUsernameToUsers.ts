import { MigrationInterface, QueryRunner } from 'typeorm';

export class addImageAndUsernameToUsers1633609357878
  implements MigrationInterface
{
  name = 'addImageAndUsernameToUsers1633609357878';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`username\` varchar(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`imageUrl\` varchar(255) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` CHANGE \`createdAt\` \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` CHANGE \`createdAt\` \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` CHANGE \`updatedAt\` \`updatedAt\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` CHANGE \`createdAt\` \`createdAt\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` CHANGE \`updatedAt\` \`updatedAt\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` CHANGE \`createdAt\` \`createdAt\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`imageUrl\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`username\`
        `);
  }
}
