import {MigrationInterface, QueryRunner} from "typeorm";

export class UsersMigration1628289433960 implements MigrationInterface {
    name = 'UsersMigration1628289433960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`facebook_clone\`.\`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`firstName\` varchar(255) NOT NULL,
                \`lastName\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`facebook_clone\`.\`users\`
        `);
    }

}
