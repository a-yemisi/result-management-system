/*
  Warnings:

  - Added the required column `subject_teacher` to the `Subjects` table without a default value. This is not possible if the table is not empty.
  - Made the column `class_id` on table `subjects` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `subjects` DROP FOREIGN KEY `Subjects_class_id_fkey`;

-- DropIndex
DROP INDEX `Subjects_class_id_fkey` ON `subjects`;

-- AlterTable
ALTER TABLE `subjects` ADD COLUMN `subject_teacher` VARCHAR(191) NOT NULL,
    MODIFY `class_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Subjects` ADD CONSTRAINT `Subjects_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `Classes`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subjects` ADD CONSTRAINT `Subjects_subject_teacher_fkey` FOREIGN KEY (`subject_teacher`) REFERENCES `StaffDetails`(`staff_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
