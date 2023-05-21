/*
  Warnings:

  - You are about to alter the column `name` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to drop the column `image2` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `categories` MODIFY `name` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `image2`;
