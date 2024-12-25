-- CreateTable
CREATE TABLE `Users` (
    `user_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_student` BOOLEAN NOT NULL,

    UNIQUE INDEX `Users_username_key`(`username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentDetails` (
    `student_id` VARCHAR(191) NOT NULL,
    `class_id` INTEGER NULL,
    `subclass_id` INTEGER NULL,
    `parent_email` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `StudentDetails_student_id_key`(`student_id`),
    PRIMARY KEY (`student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaffDetails` (
    `staff_id` VARCHAR(191) NOT NULL,
    `hire_date` DATETIME(3) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `StaffDetails_staff_id_key`(`staff_id`),
    PRIMARY KEY (`staff_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Classes` (
    `class_id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_name` VARCHAR(191) NOT NULL,
    `class_teacher` VARCHAR(191) NULL,

    PRIMARY KEY (`class_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubClasses` (
    `subclass_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subclass_name` VARCHAR(191) NOT NULL,
    `class_id` INTEGER NULL,
    `subclass_teacher` VARCHAR(191) NULL,

    PRIMARY KEY (`subclass_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaffRoles` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `StaffRoles_role_name_key`(`role_name`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permissions` (
    `permission_id` INTEGER NOT NULL AUTO_INCREMENT,
    `permission_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Permissions_permission_name_key`(`permission_name`),
    PRIMARY KEY (`permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermissions` (
    `role_id` INTEGER NOT NULL,
    `permission_id` INTEGER NOT NULL,

    PRIMARY KEY (`role_id`, `permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaffUserRoles` (
    `staff_id` VARCHAR(191) NOT NULL,
    `role_id` INTEGER NOT NULL,

    PRIMARY KEY (`staff_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AcademicYears` (
    `session_id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_name` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Terms` (
    `term_id` INTEGER NOT NULL AUTO_INCREMENT,
    `term_name` VARCHAR(191) NOT NULL,
    `session_id` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `result_released` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`term_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `setting_name` INTEGER NOT NULL AUTO_INCREMENT,
    `setting_value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`setting_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubjectTypes` (
    `type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SubjectTypes_type_name_key`(`type_name`),
    PRIMARY KEY (`type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subjects` (
    `subject_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject_name` VARCHAR(191) NOT NULL,
    `class_id` INTEGER NULL,
    `subclass_id` INTEGER NULL,
    `subject_type` INTEGER NULL,

    PRIMARY KEY (`subject_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentSubjects` (
    `student_id` VARCHAR(191) NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `ca_score` INTEGER NOT NULL DEFAULT 0,
    `exam_score` INTEGER NOT NULL DEFAULT 0,
    `total_score` INTEGER NOT NULL DEFAULT 0,
    `academic_year` INTEGER NOT NULL,
    `term` INTEGER NOT NULL,

    PRIMARY KEY (`student_id`, `subject_id`, `academic_year`, `term`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentAverageResults` (
    `student_id` VARCHAR(191) NOT NULL,
    `student_average_score` DOUBLE NOT NULL,
    `student_class` INTEGER NULL,
    `student_subclass` INTEGER NULL,
    `academic_year` INTEGER NOT NULL,
    `term` INTEGER NOT NULL,
    `is_promoted` BOOLEAN NOT NULL,
    `teacher_comment` VARCHAR(191) NULL,
    `class_teacher` VARCHAR(191) NULL,

    PRIMARY KEY (`student_id`, `academic_year`, `term`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DomainAttributes` (
    `attribute_id` INTEGER NOT NULL AUTO_INCREMENT,
    `attribute_name` VARCHAR(191) NOT NULL,
    `domain_type` ENUM('Affective', 'Psychomotor') NOT NULL,
    `min_score` INTEGER NOT NULL DEFAULT 0,
    `max_score` INTEGER NOT NULL,

    UNIQUE INDEX `DomainAttributes_attribute_name_key`(`attribute_name`),
    PRIMARY KEY (`attribute_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentDomainResults` (
    `student_id` VARCHAR(191) NOT NULL,
    `attribute_id` INTEGER NOT NULL,
    `academic_year` INTEGER NOT NULL,
    `term` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,

    PRIMARY KEY (`student_id`, `attribute_id`, `academic_year`, `term`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grades` (
    `grade_id` INTEGER NOT NULL AUTO_INCREMENT,
    `min_score` INTEGER NOT NULL,
    `max_score` INTEGER NOT NULL,
    `grade_value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`grade_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KeyRatings` (
    `value` INTEGER NOT NULL AUTO_INCREMENT,
    `rating_meaning` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`value`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLogs` (
    `log_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentDetails` ADD CONSTRAINT `StudentDetails_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentDetails` ADD CONSTRAINT `StudentDetails_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `Classes`(`class_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentDetails` ADD CONSTRAINT `StudentDetails_subclass_id_fkey` FOREIGN KEY (`subclass_id`) REFERENCES `SubClasses`(`subclass_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StaffDetails` ADD CONSTRAINT `StaffDetails_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Classes` ADD CONSTRAINT `Classes_class_teacher_fkey` FOREIGN KEY (`class_teacher`) REFERENCES `StaffDetails`(`staff_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubClasses` ADD CONSTRAINT `SubClasses_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `Classes`(`class_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubClasses` ADD CONSTRAINT `SubClasses_subclass_teacher_fkey` FOREIGN KEY (`subclass_teacher`) REFERENCES `StaffDetails`(`staff_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermissions` ADD CONSTRAINT `RolePermissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `StaffRoles`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermissions` ADD CONSTRAINT `RolePermissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `Permissions`(`permission_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StaffUserRoles` ADD CONSTRAINT `StaffUserRoles_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `StaffDetails`(`staff_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StaffUserRoles` ADD CONSTRAINT `StaffUserRoles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `StaffRoles`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Terms` ADD CONSTRAINT `Terms_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `AcademicYears`(`session_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subjects` ADD CONSTRAINT `Subjects_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `Classes`(`class_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subjects` ADD CONSTRAINT `Subjects_subclass_id_fkey` FOREIGN KEY (`subclass_id`) REFERENCES `SubClasses`(`subclass_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subjects` ADD CONSTRAINT `Subjects_subject_type_fkey` FOREIGN KEY (`subject_type`) REFERENCES `SubjectTypes`(`type_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSubjects` ADD CONSTRAINT `StudentSubjects_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `StudentDetails`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSubjects` ADD CONSTRAINT `StudentSubjects_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subjects`(`subject_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSubjects` ADD CONSTRAINT `StudentSubjects_academic_year_fkey` FOREIGN KEY (`academic_year`) REFERENCES `AcademicYears`(`session_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSubjects` ADD CONSTRAINT `StudentSubjects_term_fkey` FOREIGN KEY (`term`) REFERENCES `Terms`(`term_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAverageResults` ADD CONSTRAINT `StudentAverageResults_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `StudentDetails`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAverageResults` ADD CONSTRAINT `StudentAverageResults_student_class_fkey` FOREIGN KEY (`student_class`) REFERENCES `Classes`(`class_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAverageResults` ADD CONSTRAINT `StudentAverageResults_student_subclass_fkey` FOREIGN KEY (`student_subclass`) REFERENCES `SubClasses`(`subclass_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAverageResults` ADD CONSTRAINT `StudentAverageResults_academic_year_fkey` FOREIGN KEY (`academic_year`) REFERENCES `AcademicYears`(`session_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAverageResults` ADD CONSTRAINT `StudentAverageResults_term_fkey` FOREIGN KEY (`term`) REFERENCES `Terms`(`term_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAverageResults` ADD CONSTRAINT `StudentAverageResults_class_teacher_fkey` FOREIGN KEY (`class_teacher`) REFERENCES `StaffDetails`(`staff_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentDomainResults` ADD CONSTRAINT `StudentDomainResults_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `StudentDetails`(`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentDomainResults` ADD CONSTRAINT `StudentDomainResults_attribute_id_fkey` FOREIGN KEY (`attribute_id`) REFERENCES `DomainAttributes`(`attribute_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentDomainResults` ADD CONSTRAINT `StudentDomainResults_academic_year_fkey` FOREIGN KEY (`academic_year`) REFERENCES `AcademicYears`(`session_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentDomainResults` ADD CONSTRAINT `StudentDomainResults_term_fkey` FOREIGN KEY (`term`) REFERENCES `Terms`(`term_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLogs` ADD CONSTRAINT `AuditLogs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
