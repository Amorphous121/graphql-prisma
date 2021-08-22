/*
  Warnings:

  - Added the required column `createdOn` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comments` ADD COLUMN `createdOn` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `password` TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `comments` ADD FOREIGN KEY (`createdOn`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
