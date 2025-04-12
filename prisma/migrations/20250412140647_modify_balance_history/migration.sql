/*
  Warnings:

  - Made the column `createdAt` on table `Balance_History` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Balance_History` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
