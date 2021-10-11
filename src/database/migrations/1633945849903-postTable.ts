import {MigrationInterface, QueryRunner} from "typeorm";

export class postTable1633945849903 implements MigrationInterface {
    name = 'postTable1633945849903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`facebook_clone\`.\`posts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`post\` varchar(255) NOT NULL,
                \`fromUserId\` int NOT NULL,
                \`toUserId\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\`
            ADD CONSTRAINT \`FK_075b6eb4ee6fb4e18e10e49e8c4\` FOREIGN KEY (\`fromUserId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\`
            ADD CONSTRAINT \`FK_794b3ad9ed295ee3b6890b9bbd5\` FOREIGN KEY (\`toUserId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\` DROP FOREIGN KEY \`FK_794b3ad9ed295ee3b6890b9bbd5\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\` DROP FOREIGN KEY \`FK_075b6eb4ee6fb4e18e10e49e8c4\`
        `);
        await queryRunner.query(`
            DROP TABLE \`facebook_clone\`.\`posts\`
        `);
    }

}
