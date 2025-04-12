/*
  Warnings:

  - A unique constraint covering the columns `[memberId,couponId]` on the table `Member_Coupon` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Member_Coupon_memberId_couponId_key` ON `Member_Coupon`(`memberId`, `couponId`);
