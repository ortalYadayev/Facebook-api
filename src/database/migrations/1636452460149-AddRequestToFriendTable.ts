import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRequestToFriendTable1636452460149 implements MigrationInterface {
    name = 'AddRequestToFriendTable1636452460149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`friends\`
            ADD \`requestId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`friends\`
            ADD UNIQUE INDEX \`IDX_45c555709da6835199e01cd0e3\` (\`requestId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_45c555709da6835199e01cd0e3\` ON \`friends\` (\`requestId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`friends\`
            ADD CONSTRAINT \`FK_45c555709da6835199e01cd0e3e\` FOREIGN KEY (\`requestId\`) REFERENCES \`friend_requests\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_45c555709da6835199e01cd0e3e\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_45c555709da6835199e01cd0e3\` ON \`friends\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`friends\` DROP INDEX \`IDX_45c555709da6835199e01cd0e3\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`friends\` DROP COLUMN \`requestId\`
        `);
    }

}
