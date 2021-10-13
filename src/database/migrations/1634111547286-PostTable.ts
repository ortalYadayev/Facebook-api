import {MigrationInterface, QueryRunner} from "typeorm";

export class PostTable1634111547286 implements MigrationInterface {
    name = 'PostTable1634111547286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`facebook_clone\`.\`posts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`description\` varchar(255) NOT NULL,
                \`userId\` int NOT NULL,
                \`createdById\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\`
            ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\`
            ADD CONSTRAINT \`FK_14ee02b0fe49a09d1bcee6ce5ba\` FOREIGN KEY (\`createdById\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\` DROP FOREIGN KEY \`FK_14ee02b0fe49a09d1bcee6ce5ba\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\`
        `);
        await queryRunner.query(`
            DROP TABLE \`facebook_clone\`.\`posts\`
        `);
    }

}
