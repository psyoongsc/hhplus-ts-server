-- CreateTable
CREATE TABLE `Product_Sales_Stat_View` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `rank` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `total_amount` INTEGER NOT NULL,
    `total_sales` INTEGER NOT NULL,

    INDEX `Product_Sales_Stat_View_date_rank_idx`(`date`, `rank`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member_Coupon_Index` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `couponId` INTEGER NOT NULL,
    `isUsed` BOOLEAN NOT NULL,

    INDEX `Member_Coupon_Index_memberId_idx`(`memberId`),
    UNIQUE INDEX `Member_Coupon_Index_id_memberId_key`(`id`, `memberId`),
    UNIQUE INDEX `Member_Coupon_Index_memberId_couponId_key`(`memberId`, `couponId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order_Denorm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `productId` INTEGER NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `totalPrice` INTEGER NOT NULL,

    INDEX `Order_Denorm_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
