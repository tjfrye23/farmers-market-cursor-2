/*
  Warnings:

  - Added the required column `marketScheduleId` to the `MarketDay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `onlineEndTime` to the `MarketDay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `onlineStartTime` to the `MarketDay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MarketDay` ADD COLUMN `marketScheduleId` INTEGER NOT NULL,
    ADD COLUMN `onlineEndTime` DATETIME(3) NOT NULL,
    ADD COLUMN `onlineStartTime` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `MarketSchedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reoccurring` BOOLEAN NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `onlineStartTime` DATETIME(3) NOT NULL,
    `onlineEndTime` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MarketScheduleToVendorProfile` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MarketScheduleToVendorProfile_AB_unique`(`A`, `B`),
    INDEX `_MarketScheduleToVendorProfile_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MarketDay` ADD CONSTRAINT `MarketDay_marketScheduleId_fkey` FOREIGN KEY (`marketScheduleId`) REFERENCES `MarketSchedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MarketScheduleToVendorProfile` ADD CONSTRAINT `_MarketScheduleToVendorProfile_A_fkey` FOREIGN KEY (`A`) REFERENCES `MarketSchedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MarketScheduleToVendorProfile` ADD CONSTRAINT `_MarketScheduleToVendorProfile_B_fkey` FOREIGN KEY (`B`) REFERENCES `VendorProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
