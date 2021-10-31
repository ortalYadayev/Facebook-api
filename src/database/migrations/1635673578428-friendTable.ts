import { MigrationInterface, QueryRunner } from 'typeorm';

export class friendTable1635673578428 implements MigrationInterface {
  name = 'friendTable1635673578428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`${process.env.DB_NAME}\`.\`friend\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`friendOneId\` int NOT NULL,
                \`friendTwoId\` int NOT NULL,
                UNIQUE INDEX \`IDX_6c10bedc13179f2d6269ac1e32\` (\`friendOneId\`, \`friendTwoId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`${process.env.DB_NAME}\`.\`users\`
            ADD \`FriendsCount\` int NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE \`${process.env.DB_NAME}\`.\`friend\`
            ADD CONSTRAINT \`FK_5c4810c72fa38198fdf25e487c2\` FOREIGN KEY (\`friendOneId\`) REFERENCES \`${process.env.DB_NAME}\`.\`friend_request\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`${process.env.DB_NAME}\`.\`friend\`
            ADD CONSTRAINT \`FK_d5624201e9bd454d4eac6bbf67d\` FOREIGN KEY (\`friendTwoId\`) REFERENCES \`${process.env.DB_NAME}\`.\`friend_request\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`${process.env.DB_NAME}\`.\`friend\` DROP FOREIGN KEY \`FK_d5624201e9bd454d4eac6bbf67d\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`${process.env.DB_NAME}\`.\`friend\` DROP FOREIGN KEY \`FK_5c4810c72fa38198fdf25e487c2\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`${process.env.DB_NAME}\`.\`users\` DROP COLUMN \`FriendsCount\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_6c10bedc13179f2d6269ac1e32\` ON \`${process.env.DB_NAME}\`.\`friend\`
        `);
    await queryRunner.query(`
            DROP TABLE \`${process.env.DB_NAME}\`.\`friend\`
        `);
  }
}
