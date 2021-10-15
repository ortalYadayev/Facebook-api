import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfilePictureUrlPostTable1634325162979
  implements MigrationInterface
{
  name = 'AddProfilePictureUrlPostTable1634325162979';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` CHANGE \`imageUrl\` \`profilePicturePath\` varchar(255) NULL
        `);
    await queryRunner.query(`
            CREATE TABLE \`facebook_clone\`.\`store_posts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`content\` varchar(255) NOT NULL,
                \`userId\` int NOT NULL,
                \`createdById\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`profilePicturePath\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`profilePicturePath\` varchar(255) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`store_posts\`
            ADD CONSTRAINT \`FK_66aade0dd580b059842ff4ef939\` FOREIGN KEY (\`userId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`store_posts\`
            ADD CONSTRAINT \`FK_f96538f27fe7fe77786d5611c3b\` FOREIGN KEY (\`createdById\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`store_posts\` DROP FOREIGN KEY \`FK_f96538f27fe7fe77786d5611c3b\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`store_posts\` DROP FOREIGN KEY \`FK_66aade0dd580b059842ff4ef939\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`profilePicturePath\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`profilePicturePath\` varchar(255) NULL
        `);
    await queryRunner.query(`
            DROP TABLE \`facebook_clone\`.\`store_posts\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` CHANGE \`profilePicturePath\` \`imageUrl\` varchar(255) NULL
        `);
  }
}
