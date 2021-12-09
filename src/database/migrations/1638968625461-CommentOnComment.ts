import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommentOnComment1638968625461 implements MigrationInterface {
  name = 'CommentOnComment1638968625461';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`comments\`
            ADD \`commentId\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_e44ddaaa6d058cb4092f83ad61f\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`comments\` CHANGE \`postId\` \`postId\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`comments\`
            ADD CONSTRAINT \`FK_e44ddaaa6d058cb4092f83ad61f\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE \`comments\`
            ADD CONSTRAINT \`FK_b302f2e474ce2a6cbacd7981aa5\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_b302f2e474ce2a6cbacd7981aa5\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_e44ddaaa6d058cb4092f83ad61f\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`comments\` CHANGE \`postId\` \`postId\` int NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`comments\`
            ADD CONSTRAINT \`FK_e44ddaaa6d058cb4092f83ad61f\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE \`comments\` DROP COLUMN \`commentId\`
        `);
  }
}
