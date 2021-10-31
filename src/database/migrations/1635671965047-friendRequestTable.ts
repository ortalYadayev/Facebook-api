import { MigrationInterface, QueryRunner } from 'typeorm';

export class friendRequestTable1635671965047 implements MigrationInterface {
  name = 'friendRequestTable1635671965047';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`${process.env.DB_NAME}\`.\`friend_request\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` enum ('sent_request', 'accepted_request') NOT NULL,
                \`userOneId\` int NOT NULL,
                \`userTwoId\` int NOT NULL,
                UNIQUE INDEX \`IDX_58c7781b8a2f1c2a6c9a8bbdae\` (\`userOneId\`, \`userTwoId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`${process.env.DB_NAME}\`.\`friend_request\`
            ADD CONSTRAINT \`FK_da0ab0499d79df1708f15573ca2\` FOREIGN KEY (\`userOneId\`) REFERENCES \`${process.env.DB_NAME}\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`${process.env.DB_NAME}\`.\`friend_request\`
            ADD CONSTRAINT \`FK_534e88cbe4320607e4b08e79f2a\` FOREIGN KEY (\`userTwoId\`) REFERENCES \`${process.env.DB_NAME}\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`${process.env.DB_NAME}\`.\`friend_request\` DROP FOREIGN KEY \`FK_534e88cbe4320607e4b08e79f2a\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`${process.env.DB_NAME}\`.\`friend_request\` DROP FOREIGN KEY \`FK_da0ab0499d79df1708f15573ca2\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_58c7781b8a2f1c2a6c9a8bbdae\` ON \`${process.env.DB_NAME}\`.\`friend_request\`
        `);
    await queryRunner.query(`
            DROP TABLE \`${process.env.DB_NAME}\`.\`friend_request\`
        `);
  }
}
