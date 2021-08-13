import {MigrationInterface, QueryRunner} from "typeorm";

export class UserVerificationsTable1628856675394 implements MigrationInterface {
    name = 'UserVerificationsTable1628856675394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`facebook_clone\`.\`user_verifications\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`token\` varchar(255) NOT NULL,
                \`userId\` int NOT NULL,
                UNIQUE INDEX \`IDX_4643e12d8c71d509ff5a69932e\` (\`token\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`user_verifications\`
            ADD CONSTRAINT \`FK_b5aadfc04db5b23d06c0447e0f4\` FOREIGN KEY (\`userId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`user_verifications\` DROP FOREIGN KEY \`FK_b5aadfc04db5b23d06c0447e0f4\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_4643e12d8c71d509ff5a69932e\` ON \`facebook_clone\`.\`user_verifications\`
        `);
        await queryRunner.query(`
            DROP TABLE \`facebook_clone\`.\`user_verifications\`
        `);
    }

}
