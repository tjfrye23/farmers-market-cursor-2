/*
  Warnings:

  - Added the required column `endTime` to the `MarketDay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `MarketDay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MarketDay` ADD COLUMN `endTime` DATETIME(3) NOT NULL,
    ADD COLUMN `startTime` DATETIME(3) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE `_MarketDayToVendorProfile` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MarketDayToVendorProfile_AB_unique`(`A`, `B`),
    INDEX `_MarketDayToVendorProfile_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_MarketDayToVendorProfile` ADD CONSTRAINT `_MarketDayToVendorProfile_A_fkey` FOREIGN KEY (`A`) REFERENCES `MarketDay`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MarketDayToVendorProfile` ADD CONSTRAINT `_MarketDayToVendorProfile_B_fkey` FOREIGN KEY (`B`) REFERENCES `VendorProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
