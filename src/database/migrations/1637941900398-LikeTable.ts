import {MigrationInterface, QueryRunner} from "typeorm";

export class LikeTable1637941900398 implements MigrationInterface {
    name = 'LikeTable1637941900398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`likes\` DROP COLUMN \`dislikeAt\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`likes\`
            ADD \`dislikeAt\` datetime NULL
        `);
    }

}
