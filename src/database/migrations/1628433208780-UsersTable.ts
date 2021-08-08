import {MigrationInterface, QueryRunner} from "typeorm";

export class UsersTable1628433208780 implements MigrationInterface {
    name = 'UsersTable1628433208780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`facebook_clone\`.\`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`first_name\` varchar(255) NOT NULL,
                \`last_name\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`facebook_clone\`.\`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`facebook_clone\`.\`users\`
        `);
    }

}
