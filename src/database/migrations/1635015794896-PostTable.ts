import {MigrationInterface, QueryRunner} from "typeorm";

export class PostTable1635015794896 implements MigrationInterface {
    name = 'PostTable1635015794896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`facebook_clone\`.\`url_tokens\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`type\` enum ('email_verification') NOT NULL,
                \`token\` varchar(255) NOT NULL,
                \`expireAt\` datetime NULL,
                \`userId\` int NULL,
                UNIQUE INDEX \`IDX_a2822d37fa5c0456c6f1a82ff8\` (\`token\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`facebook_clone\`.\`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`firstName\` varchar(50) NOT NULL,
                \`lastName\` varchar(50) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`username\` varchar(20) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`verifiedAt\` datetime NULL,
                \`profilePicturePath\` varchar(255) NULL,
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`facebook_clone\`.\`posts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`content\` varchar(255) NOT NULL,
                \`userId\` int NOT NULL,
                \`friendId\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\`
            ADD CONSTRAINT \`FK_2d85a0e769ad0d87b4d1e78ebf0\` FOREIGN KEY (\`userId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\`
            ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\`
            ADD CONSTRAINT \`FK_f82334e9bdabd80a7ea07e5269a\` FOREIGN KEY (\`friendId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\` DROP FOREIGN KEY \`FK_f82334e9bdabd80a7ea07e5269a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` DROP FOREIGN KEY \`FK_2d85a0e769ad0d87b4d1e78ebf0\`
        `);
        await queryRunner.query(`
            DROP TABLE \`facebook_clone\`.\`posts\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`facebook_clone\`.\`users\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`facebook_clone\`.\`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`facebook_clone\`.\`users\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_a2822d37fa5c0456c6f1a82ff8\` ON \`facebook_clone\`.\`url_tokens\`
        `);
        await queryRunner.query(`
            DROP TABLE \`facebook_clone\`.\`url_tokens\`
        `);
    }

}
