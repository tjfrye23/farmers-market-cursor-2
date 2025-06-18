/*
  Warnings:

  - Made the column `category` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `email` to the `VendorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headerImageUrl` to the `VendorProfile` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `VendorProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `category` VARCHAR(191) NOT NULL,
    MODIFY `imageUrl` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `VendorProfile` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `headerImageUrl` VARCHAR(191) NOT NULL,
    MODIFY `description` TEXT NOT NULL;
