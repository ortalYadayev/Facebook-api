import { MigrationInterface, QueryRunner } from 'typeorm';

export class addProfileImageUrl1635163392269 implements MigrationInterface {
  name = 'addProfileImageUrl1635163392269';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`facebook_clone\`.\`posts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`content\` varchar(255) NOT NULL,
                \`userId\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`username\` varchar(20) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`profilePicturePath\` varchar(255) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` CHANGE \`createdAt\` \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` CHANGE \`createdAt\` \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`firstName\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`firstName\` varchar(50) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`lastName\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`lastName\` varchar(50) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\`
            ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`lastName\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`lastName\` varchar(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`firstName\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`firstName\` varchar(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` CHANGE \`updatedAt\` \`updatedAt\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` CHANGE \`createdAt\` \`createdAt\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` CHANGE \`updatedAt\` \`updatedAt\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` CHANGE \`createdAt\` \`createdAt\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`profilePicturePath\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`username\`
        `);
    await queryRunner.query(`
            DROP TABLE \`facebook_clone\`.\`posts\`
        `);
  }
}
