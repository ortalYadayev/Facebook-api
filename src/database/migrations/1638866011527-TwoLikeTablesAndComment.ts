import { MigrationInterface, QueryRunner } from 'typeorm';

export class TwoLikeTablesAndComment1638866011527
  implements MigrationInterface
{
  name = 'TwoLikeTablesAndComment1638866011527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`post_likes\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`postId\` int NOT NULL,
                \`userId\` int NOT NULL,
                UNIQUE INDEX \`IDX_30ee85070afe5b92b5920957b1\` (\`postId\`, \`userId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`comments\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`content\` varchar(255) NOT NULL,
                \`postId\` int NOT NULL,
                \`userId\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`comment_likes\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`commentId\` int NOT NULL,
                \`userId\` int NOT NULL,
                UNIQUE INDEX \`IDX_ec6698ead14ad945033ebb2f1b\` (\`commentId\`, \`userId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`post_likes\`
            ADD CONSTRAINT \`FK_6999d13aca25e33515210abaf16\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);

    await queryRunner.query(`
            ALTER TABLE \`post_likes\`
            ADD CONSTRAINT \`FK_37d337ad54b1aa6b9a44415a498\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE \`comments\`
            ADD CONSTRAINT \`FK_e44ddaaa6d058cb4092f83ad61f\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE \`comments\`
            ADD CONSTRAINT \`FK_7e8d7c49f218ebb14314fdb3749\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE \`comment_likes\`
            ADD CONSTRAINT \`FK_abbd506a94a424dd6a3a68d26f4\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE \`comment_likes\`
            ADD CONSTRAINT \`FK_34d1f902a8a527dbc2502f87c88\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`comment_likes\` DROP FOREIGN KEY \`FK_34d1f902a8a527dbc2502f87c88\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`comment_likes\` DROP FOREIGN KEY \`FK_abbd506a94a424dd6a3a68d26f4\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_7e8d7c49f218ebb14314fdb3749\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_e44ddaaa6d058cb4092f83ad61f\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`post_likes\` DROP FOREIGN KEY \`FK_37d337ad54b1aa6b9a44415a498\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`post_likes\` DROP FOREIGN KEY \`FK_6999d13aca25e33515210abaf16\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_ec6698ead14ad945033ebb2f1b\` ON \`comment_likes\`
        `);
    await queryRunner.query(`
            DROP TABLE \`comment_likes\`
        `);
    await queryRunner.query(`
            DROP TABLE \`comments\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_30ee85070afe5b92b5920957b1\` ON \`post_likes\`
        `);
    await queryRunner.query(`
            DROP TABLE \`post_likes\`
        `);
  }
}
