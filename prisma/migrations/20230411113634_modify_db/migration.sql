/*
  Warnings:

  - You are about to alter the column `image1` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `image2` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `detail` VARCHAR(500) NULL,
    MODIFY `image1` VARCHAR(100) NOT NULL,
    MODIFY `image2` VARCHAR(100) NOT NULL;
