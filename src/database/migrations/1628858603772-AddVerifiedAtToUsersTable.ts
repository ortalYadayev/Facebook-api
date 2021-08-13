import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddVerifiedAtToUsersTable1628858603772 implements MigrationInterface {
    name = 'AddVerifiedAtToUsersTable1628858603772'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn("users", new TableColumn({
        name: "verifiedAt",
        type: "datetime",
        isNullable: true,
        default: null
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`verifiedAt\`
        `);
    }

}
