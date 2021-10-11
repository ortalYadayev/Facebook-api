import {MigrationInterface, QueryRunner} from "typeorm";

export class postTable1633940491554 implements MigrationInterface {
    name = 'postTable1633940491554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`facebook_clone\`.\`posts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`post\` varchar(255) NOT NULL,
                \`uploadDate\` datetime NOT NULL,
                \`userFromId\` int NULL,
                \`userToId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\`
            ADD CONSTRAINT \`FK_c0f5a09c204f27f291d27bbfecf\` FOREIGN KEY (\`userFromId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\`
            ADD CONSTRAINT \`FK_d3f2b53999a26ee15f99b5818dd\` FOREIGN KEY (\`userToId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\` DROP FOREIGN KEY \`FK_d3f2b53999a26ee15f99b5818dd\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\` DROP FOREIGN KEY \`FK_c0f5a09c204f27f291d27bbfecf\`
        `);
        await queryRunner.query(`
            DROP TABLE \`facebook_clone\`.\`posts\`
        `);
    }

}
