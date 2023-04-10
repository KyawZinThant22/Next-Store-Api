/*
  Warnings:

  - The primary key for the `customers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fullName` on the `customers` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `email` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - Added the required column `fullname` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customers` DROP PRIMARY KEY,
    DROP COLUMN `fullName`,
    ADD COLUMN `fullname` VARCHAR(50) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `email` VARCHAR(50) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);
