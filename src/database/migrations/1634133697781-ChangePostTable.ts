import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangePostTable1634133697781 implements MigrationInterface {
    name = 'ChangePostTable1634133697781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` CHANGE \`imageUrl\` \`profilePicturePath\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\` CHANGE \`description\` \`content\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`profilePicturePath\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`profilePicturePath\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\` DROP COLUMN \`content\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\`
            ADD \`content\` varchar(255) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\` DROP COLUMN \`content\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\`
            ADD \`content\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`profilePicturePath\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`profilePicturePath\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`posts\` CHANGE \`content\` \`description\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` CHANGE \`profilePicturePath\` \`imageUrl\` varchar(255) NULL
        `);
    }

}
