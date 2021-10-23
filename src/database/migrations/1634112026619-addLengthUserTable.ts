import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLengthUserTable1634112026619 implements MigrationInterface {
  name = 'addLengthUserTable1634112026619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`firstName\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`firstName\` varchar(50) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`lastName\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`lastName\` varchar(50) NOT NULL
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`facebook_clone\`.\`users\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`username\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`username\` varchar(20) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`username\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`username\` varchar(255) NOT NULL
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`facebook_clone\`.\`users\` (\`username\`)
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`lastName\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`lastName\` varchar(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\` DROP COLUMN \`firstName\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`facebook_clone\`.\`users\`
            ADD \`firstName\` varchar(255) NOT NULL
        `);
  }
}
