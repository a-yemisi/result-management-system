-- AlterTable
ALTER TABLE `staffdetails` ADD COLUMN `deactivated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `studentdetails` ADD COLUMN `deactivated_at` DATETIME(3) NULL,
    ADD COLUMN `graduated` BOOLEAN NOT NULL DEFAULT false;
