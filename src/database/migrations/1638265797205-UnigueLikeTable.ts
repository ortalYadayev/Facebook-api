import { MigrationInterface, QueryRunner } from 'typeorm';

export class UnigueLikeTable1638265797205 implements MigrationInterface {
  name = 'UnigueLikeTable1638265797205';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_74b9b8cd79a1014e50135f266f\` ON \`likes\` (\`postId\`, \`userId\`)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX \`IDX_74b9b8cd79a1014e50135f266f\` ON \`likes\`
        `);
  }
}
