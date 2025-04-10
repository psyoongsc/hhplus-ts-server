/*
  Warnings:

  - You are about to drop the column `error_code` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `error_message` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `pay_method` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `pg_name` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `receipt_url` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `Payment` table. All the data in the column will be lost.
  - Made the column `approved_at` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `error_code`,
    DROP COLUMN `error_message`,
    DROP COLUMN `pay_method`,
    DROP COLUMN `pg_name`,
    DROP COLUMN `receipt_url`,
    DROP COLUMN `transaction_id`,
    MODIFY `approved_at` DATETIME(3) NOT NULL;
