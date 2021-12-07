import {MigrationInterface, QueryRunner} from "typeorm";

export class CommentOnCommentTable1638868680585 implements MigrationInterface {
    name = 'CommentOnCommentTable1638868680585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`comment_on_comments\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`content\` varchar(255) NOT NULL,
                \`commentId\` int NOT NULL,
                \`userId\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`comment_on_comments\`
            ADD CONSTRAINT \`FK_13b9f0c38179181be5119c56bc4\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`comment_on_comments\`
            ADD CONSTRAINT \`FK_24f4ce5f2a843b76b0e9d98a257\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`comment_on_comments\` DROP FOREIGN KEY \`FK_24f4ce5f2a843b76b0e9d98a257\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`comment_on_comments\` DROP FOREIGN KEY \`FK_13b9f0c38179181be5119c56bc4\`
        `);
        await queryRunner.query(`
            DROP TABLE \`comment_on_comments\`
        `);
    }

}
