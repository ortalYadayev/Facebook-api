import { MigrationInterface, QueryRunner } from 'typeorm';

export class indexUserTable1635418272470 implements MigrationInterface {
  name = 'indexUserTable1635418272470';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE FULLTEXT INDEX \`IDX_9b83803f5624b6f6b23db8151c\` ON \`facebook_clone\`.\`users\` (\`firstName\`, \`lastName\`)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX \`IDX_9b83803f5624b6f6b23db8151c\` ON \`facebook_clone\`.\`users\`
        `);
  }
}
