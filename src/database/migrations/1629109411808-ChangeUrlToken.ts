import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeUrlToken1629109411808 implements MigrationInterface {
    name = 'ChangeUrlToken1629109411808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` DROP FOREIGN KEY \`FK_2d85a0e769ad0d87b4d1e78ebf0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` CHANGE \`userId\` \`userId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\`
            ADD CONSTRAINT \`FK_2d85a0e769ad0d87b4d1e78ebf0\` FOREIGN KEY (\`userId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` DROP FOREIGN KEY \`FK_2d85a0e769ad0d87b4d1e78ebf0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\` CHANGE \`userId\` \`userId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`url_tokens\`
            ADD CONSTRAINT \`FK_2d85a0e769ad0d87b4d1e78ebf0\` FOREIGN KEY (\`userId\`) REFERENCES \`facebook_clone\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
