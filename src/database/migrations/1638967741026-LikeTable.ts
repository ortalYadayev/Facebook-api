import {MigrationInterface, QueryRunner} from "typeorm";

export class LikeTable1638967741026 implements MigrationInterface {
    name = 'LikeTable1638967741026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`likes\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`postId\` int NULL,
                \`commentId\` int NULL,
                \`userId\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`likes\`
            ADD CONSTRAINT \`FK_e2fe567ad8d305fefc918d44f50\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`likes\`
            ADD CONSTRAINT \`FK_ec3c75d6522fc60e0ebaf58a6b7\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`likes\`
            ADD CONSTRAINT \`FK_cfd8e81fac09d7339a32e57d904\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_cfd8e81fac09d7339a32e57d904\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_ec3c75d6522fc60e0ebaf58a6b7\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_e2fe567ad8d305fefc918d44f50\`
        `);
        await queryRunner.query(`
            DROP TABLE \`likes\`
        `);
    }

}
