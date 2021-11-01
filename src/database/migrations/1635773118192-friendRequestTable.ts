import { MigrationInterface, QueryRunner } from 'typeorm';

export class friendRequestTable1635773118192 implements MigrationInterface {
  name = 'friendRequestTable1635773118192';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }
}
