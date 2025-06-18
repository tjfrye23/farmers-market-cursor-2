/*
  Warnings:

  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Product` DROP COLUMN `stock`;

-- CreateTable
CREATE TABLE `VendorOrderStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `vendorProfileId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `VendorOrderStatus_orderId_vendorProfileId_key`(`orderId`, `vendorProfileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VendorOrderStatus` ADD CONSTRAINT `VendorOrderStatus_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorOrderStatus` ADD CONSTRAINT `VendorOrderStatus_vendorProfileId_fkey` FOREIGN KEY (`vendorProfileId`) REFERENCES `VendorProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
