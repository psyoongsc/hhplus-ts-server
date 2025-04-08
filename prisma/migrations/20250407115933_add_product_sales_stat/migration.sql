-- CreateTable
CREATE TABLE `Product_Sales_Stat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `salesDate` DATETIME(3) NOT NULL,
    `total_sales` INTEGER NOT NULL DEFAULT 0,
    `total_amount` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product_Sales_Stat` ADD CONSTRAINT `Product_Sales_Stat_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
