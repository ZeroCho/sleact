import { MigrationInterface, QueryRunner } from 'typeorm';

export class categoryToType1647063094878 implements MigrationInterface {
  name = 'categoryToType1647063094878';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `category` TO `type`',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `type` TO `category`',
    );
  }
}
