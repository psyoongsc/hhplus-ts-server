/*
  Warnings:

  - Added the required column `productName` to the `Product_Sales_Stat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Product_Sales_Stat` DROP FOREIGN KEY `Product_Sales_Stat_productId_fkey`;

-- DropIndex
DROP INDEX `Product_Sales_Stat_productId_fkey` ON `Product_Sales_Stat`;

-- AlterTable
ALTER TABLE `Product_Sales_Stat` ADD COLUMN `productName` VARCHAR(191) NOT NULL;
