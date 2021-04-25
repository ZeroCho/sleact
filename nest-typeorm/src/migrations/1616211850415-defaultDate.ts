import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class defaultDate1616211850415 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE channelchats MODIFY createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL;\n',
    );
    await queryRunner.query(
      'ALTER TABLE channelchats MODIFY updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL;\n',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE channelchats ALTER COLUMN createdAt DROP DEFAULT',
    );
    await queryRunner.query(
      'ALTER TABLE channelchats ALTER COLUMN updatedAt DROP DEFAULT',
    );
  }
}
