import { MigrationInterface, QueryRunner } from 'typeorm';

export class friendRequestTable1635757672639 implements MigrationInterface {
  name = 'friendRequestTable1635757672639';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`${process.env.DB_NAME}\`.\`friend_request\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` enum ('Pending', 'rejected', 'approved', 'deleted') NOT NULL,
                \`senderId\` int NOT NULL,
                \`receiverId\` int NOT NULL,
                UNIQUE INDEX \`IDX_3480812cafecf9155f4658b35e\` (\`senderId\`, \`receiverId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`${process.env.DB_NAME}\`.\`friend_request\`
            ADD CONSTRAINT \`FK_9509b72f50f495668bae3c0171c\` FOREIGN KEY (\`senderId\`) REFERENCES \`${process.env.DB_NAME}\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`${process.env.DB_NAME}\`.\`friend_request\`
            ADD CONSTRAINT \`FK_470e723fdad9d6f4981ab2481eb\` FOREIGN KEY (\`receiverId\`) REFERENCES \`${process.env.DB_NAME}\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`${process.env.DB_NAME}\`.\`friend_request\` DROP FOREIGN KEY \`FK_470e723fdad9d6f4981ab2481eb\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`${process.env.DB_NAME}\`.\`friend_request\` DROP FOREIGN KEY \`FK_9509b72f50f495668bae3c0171c\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_3480812cafecf9155f4658b35e\` ON \`${process.env.DB_NAME}\`.\`friend_request\`
        `);
    await queryRunner.query(`
            DROP TABLE \`${process.env.DB_NAME}\`.\`friend_request\`
        `);
  }
}
