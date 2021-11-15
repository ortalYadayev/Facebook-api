import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOnDelete1636970084924 implements MigrationInterface {
    name = 'AddOnDelete1636970084924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_45c555709da6835199e01cd0e3e\`
        `);
        await queryRunner.query(`
            DROP INDEX \`FK_2d85a0e769ad0d87b4d1e78ebf0\` ON \`url_tokens\`
        `);
        await queryRunner.query(`
            DROP INDEX \`FK_ae05faaa55c866130abef6e1fee\` ON \`posts\`
        `);
        await queryRunner.query(`
            DROP INDEX \`FK_3d08aa2b7a950065996558fb6a0\` ON \`friends\`
        `);
        await queryRunner.query(`
            DROP INDEX \`FK_3e161d03f97566f6de690f8c931\` ON \`friends\`
        `);
        await queryRunner.query(`
            DROP INDEX \`FK_a1686285850a043d7a5a468440d\` ON \`friends\`
        `);
        await queryRunner.query(`
            DROP INDEX \`FK_97c256506348f9347b3a8a35629\` ON \`friend_requests\`
        `);
        await queryRunner.query(`
            DROP INDEX \`FK_da724334b35796722ad87d31884\` ON \`friend_requests\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`url_tokens\`
            ADD CONSTRAINT \`FK_2d85a0e769ad0d87b4d1e78ebf0\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`posts\`
            ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`friends\`
            ADD CONSTRAINT \`FK_3e161d03f97566f6de690f8c931\` FOREIGN KEY (\`senderId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`friends\`
            ADD CONSTRAINT \`FK_a1686285850a043d7a5a468440d\` FOREIGN KEY (\`receiverId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`friends\`
            ADD CONSTRAINT \`FK_3d08aa2b7a950065996558fb6a0\` FOREIGN KEY (\`deletedById\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`friends\`
            ADD CONSTRAINT \`FK_45c555709da6835199e01cd0e3e\` FOREIGN KEY (\`requestId\`) REFERENCES \`friend_requests\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`friend_requests\`
            ADD CONSTRAINT \`FK_da724334b35796722ad87d31884\` FOREIGN KEY (\`senderId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`friend_requests\`
            ADD CONSTRAINT \`FK_97c256506348f9347b3a8a35629\` FOREIGN KEY (\`receiverId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`friend_requests\` DROP FOREIGN KEY \`FK_97c256506348f9347b3a8a35629\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`friend_requests\` DROP FOREIGN KEY \`FK_da724334b35796722ad87d31884\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_45c555709da6835199e01cd0e3e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_3d08aa2b7a950065996558fb6a0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_a1686285850a043d7a5a468440d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_3e161d03f97566f6de690f8c931\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`url_tokens\` DROP FOREIGN KEY \`FK_2d85a0e769ad0d87b4d1e78ebf0\`
        `);
        await queryRunner.query(`
            CREATE INDEX \`FK_da724334b35796722ad87d31884\` ON \`friend_requests\` (\`senderId\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`FK_97c256506348f9347b3a8a35629\` ON \`friend_requests\` (\`receiverId\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`FK_a1686285850a043d7a5a468440d\` ON \`friends\` (\`receiverId\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`FK_3e161d03f97566f6de690f8c931\` ON \`friends\` (\`senderId\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`FK_3d08aa2b7a950065996558fb6a0\` ON \`friends\` (\`deletedById\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`FK_ae05faaa55c866130abef6e1fee\` ON \`posts\` (\`userId\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`FK_2d85a0e769ad0d87b4d1e78ebf0\` ON \`url_tokens\` (\`userId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`friends\`
            ADD CONSTRAINT \`FK_45c555709da6835199e01cd0e3e\` FOREIGN KEY (\`requestId\`) REFERENCES \`friend_requests\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
