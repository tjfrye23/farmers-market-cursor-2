/*
  Warnings:

  - You are about to drop the `VendorOrderStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `VendorOrderStatus` DROP FOREIGN KEY `VendorOrderStatus_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `VendorOrderStatus` DROP FOREIGN KEY `VendorOrderStatus_vendorProfileId_fkey`;

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'processing';

-- DropTable
DROP TABLE `VendorOrderStatus`;
