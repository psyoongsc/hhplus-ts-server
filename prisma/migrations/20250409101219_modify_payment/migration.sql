/*
  Warnings:

  - You are about to drop the column `PGCompany` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `discountedSales` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `paidAmount` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `payMethod` on the `Payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_orderId_fkey`;

-- DropIndex
DROP INDEX `Payment_orderId_key` ON `Payment`;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `PGCompany`,
    DROP COLUMN `discountedSales`,
    DROP COLUMN `paidAmount`,
    DROP COLUMN `payMethod`,
    ADD COLUMN `approved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `error_code` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `error_message` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `paid_amount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `pay_method` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `pg_name` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `receipt_url` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `transaction_id` VARCHAR(191) NOT NULL DEFAULT '';

-- DropForeignKey
ALTER TABLE `Payment` DROP CONSTRAINT `Payment_memberId_fkey`;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
