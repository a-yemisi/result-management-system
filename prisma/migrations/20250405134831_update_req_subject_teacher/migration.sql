-- DropForeignKey
ALTER TABLE `subjects` DROP FOREIGN KEY `Subjects_subject_teacher_fkey`;

-- DropIndex
DROP INDEX `Subjects_subject_teacher_fkey` ON `subjects`;

-- AlterTable
ALTER TABLE `subjects` MODIFY `subject_teacher` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Subjects` ADD CONSTRAINT `Subjects_subject_teacher_fkey` FOREIGN KEY (`subject_teacher`) REFERENCES `StaffDetails`(`staff_id`) ON DELETE SET NULL ON UPDATE CASCADE;
