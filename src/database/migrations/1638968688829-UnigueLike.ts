import { MigrationInterface, QueryRunner } from 'typeorm';

export class UnigueLike1638968688829 implements MigrationInterface {
  name = 'UnigueLike1638968688829';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_c375aba0f3323c250caeafcb7f\` ON \`likes\` (\`commentId\`, \`userId\`)
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_74b9b8cd79a1014e50135f266f\` ON \`likes\` (\`postId\`, \`userId\`)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX \`IDX_74b9b8cd79a1014e50135f266f\` ON \`likes\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_c375aba0f3323c250caeafcb7f\` ON \`likes\`
        `);
  }
}
