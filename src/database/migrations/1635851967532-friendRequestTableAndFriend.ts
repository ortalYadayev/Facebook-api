import { MigrationInterface, QueryRunner } from 'typeorm';

export class friendRequestTableAndFriend1635851967532
  implements MigrationInterface
{
  name = 'friendRequestTableAndFriend1635851967532';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`facebook_clone\`.\`friends\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime NULL,
                \`senderId\` int NOT NULL,
                \`receiverId\` int NOT NULL,
                \`deletedById\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`facebook_clone\`.\`friend_requests\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`rejectedAt\` datetime NULL,
                \`deletedAt\` datetime NULL,
                \`approvedAt\` datetime NULL,
                \`senderId\` int NOT NULL,
                \`receiverId\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`friends\`
            ADD CONSTRAINT \`FK_3e161d03f97566f6de690f8c931\` FOREIGN KEY (\`senderId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`friends\`
            ADD CONSTRAINT \`FK_a1686285850a043d7a5a468440d\` FOREIGN KEY (\`receiverId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`friends\`
            ADD CONSTRAINT \`FK_3d08aa2b7a950065996558fb6a0\` FOREIGN KEY (\`deletedById\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`friend_requests\`
            ADD CONSTRAINT \`FK_da724334b35796722ad87d31884\` FOREIGN KEY (\`senderId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`friend_requests\`
            ADD CONSTRAINT \`FK_97c256506348f9347b3a8a35629\` FOREIGN KEY (\`receiverId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`friend_requests\` DROP FOREIGN KEY \`FK_97c256506348f9347b3a8a35629\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`friend_requests\` DROP FOREIGN KEY \`FK_da724334b35796722ad87d31884\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`friends\` DROP FOREIGN KEY \`FK_3d08aa2b7a950065996558fb6a0\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`friends\` DROP FOREIGN KEY \`FK_a1686285850a043d7a5a468440d\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`friends\` DROP FOREIGN KEY \`FK_3e161d03f97566f6de690f8c931\`
        `);
    await queryRunner.query(`
            DROP TABLE \`facebook_clone\`.\`friend_requests\`
        `);
    await queryRunner.query(`
            DROP TABLE \`facebook_clone\`.\`friends\`
        `);
  }
}
