const { PrismaClient, Users, StaffUserRoles } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seedClasses() {
  console.log("Seeding Classes...");
  await prisma.classes.createMany({
    data: [
      { class_name: "JSS One" },
      { class_name: "JSS Two" },
      { class_name: "JSS Three" },
      { class_name: "SSS One" },
      { class_name: "SSS Two" },
      { class_name: "SSS Three" },
    ],
  });
  console.log("Classes created successfully!");
}

async function seedSubClasses() {
  console.log("Seeding sub classes...");
  const classes = await prisma.classes.findMany();

  if (classes.length === 0) {
    console.error("Classes table is empty, seed those tables first!");
    return;
  }

  const subclasses = [
    {
      subclass_name: "Science",
      class_ids: [
        classes[3].class_id,
        classes[4].class_id,
        classes[5].class_id,
      ],
    },
    {
      subclass_name: "Arts and Humanity",
      class_ids: [
        classes[3].class_id,
        classes[4].class_id,
        classes[5].class_id,
      ],
    },
    {
      subclass_name: "Commercial",
      class_ids: [
        classes[3].class_id,
        classes[4].class_id,
        classes[5].class_id,
      ],
    },
  ];

  for (const subclass of subclasses) {
    for (const class_id of subclass.class_ids) {
      await prisma.subClasses.create({
        data: {
          subclass_name: subclass.subclass_name,
          class_id: class_id,
        },
      });
    }
  }
  console.log("Sub classes seeded successfully!");
}

async function seedAdminStudentUser() {
  try {
    console.log("Seeding two users, one for student and another for staff");
    console.log("For student user...");
    const hashedPassword = await bcrypt.hash("password", 10);
    const studentUser = await prisma.users.create({
      data: {
        username: "admin.student",
        password_hash: hashedPassword,
        first_name: "Admin",
        last_name: "Student",
        is_student: true,
        StudentDetails: {
          create: {
            class_id: 4,
            subclass_id: 2,
            parent_email: "yemisi.akinfesola@gmail.com",
            is_active: true,
          },
        },
      },
    });

    console.log("Student user created:", studentUser);
  } catch (error) {
    console.error(`Error seeding staff roles: ${error}`);
  }
}

async function seedStaffRoles() {
  try {
    console.log("Seeding staff roles...");
    await prisma.staffRoles.createMany({
      data: [
        { role_name: "Teacher" },
        { role_name: "Class Teacher" },
        { role_name: "Vice Principal" },
        { role_name: "Principal" },
        { role_name: "Owner" },
        { role_name: "Administrator" },
      ],
    });
    console.log("Seeded staff roles successfully");
  } catch (error) {
    console.error(`Error seeding staff roles: ${error}`);
  }
}

async function seedAdminStaffUser() {
  try {
    console.log("Seeding staff user...");
    // const hashedPassword = await bcrypt.hash("password", 10);
    // const staffUser = await prisma.users.create({
    //   data: {
    //     username: "admin.staff",
    //     password_hash: hashedPassword,
    //     first_name: "Admin",
    //     last_name: "Staff",
    //     is_student: false,
    //     StaffDetails: {
    //       create: {
    //         hire_date: new Date("2023-01-01"),
    //         is_active: true,
    //       },
    //     },
    //   },
    // });

    // console.log(
    //   `Created Staff User Successfully: ${JSON.stringify(staffUser)}`
    // );

    console.log("Assigning staff role...");

    const staffUser = await prisma.users.findUnique({
      where: { username: "admin.staff" },
    });
    console.log("Staff user details...");

    console.log(staffUser);

    const staffRoleTeacher = await prisma.staffRoles.findUnique({
      where: { role_name: "Teacher" },
    });
    const staffRoleAdminstrator = await prisma.staffRoles.findUnique({
      where: { role_name: "Owner" },
    });
    // await prisma.staffUserRoles.create({
    //   data: {
    //     staff_id: staffUser.user_id,
    //     role_id: staffRoleTeacher.role_id,
    //   },
    // });
    await prisma.staffUserRoles.create({
      data: {
        staff_id: staffUser.user_id,
        role_id: staffRoleAdminstrator.role_id,
      },
    });
    console.log("Assigned staff roles successfully");
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

async function retrieveMultipleData() {
  try {
    const aCurrentStaff = await prisma.users.findUnique({
      where: { username: "admin.staff" },
    });

    const staffRoleAggregate = await prisma.staffUserRoles.aggregate({
      where: { staff_id: aCurrentStaff.user_id },
      _max: { role_id: true },
    });

    const maxStaffRole = staffRoleAggregate._max?.role_id;
    const viewingRole = await prisma.staffRoles.findUnique({
      where: { role_id: maxStaffRole },
    });

    console.log(viewingRole.role_name);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

async function seedSubjectTypes() {
  try {
    await prisma.subjectTypes.createMany({
      data: [{ type_name: "Compulsory" }, { type_name: "Optional" }],
    });
  } catch (error) {
    console.error(`Error seeding subject types... ${error}`);
  }
}

async function seedSubjects(
  subjectTeacherUsername: string,
  subjectTypeName: string,
  subjectClassName: string,
  subjectName: string,
  studentSubClass?: string
) {
  try {
    // Get subject teacher
    const aCurrentStaff = await prisma.users.findUnique({
      select: { user_id: true },
      where: { username: subjectTeacherUsername },
    });

    // Get class subject belongs to
    const aCurrentClass = await prisma.classes.findFirst({
      select: { class_id: true },
      where: { class_name: subjectClassName },
    });

    const subjectType = await prisma.subjectTypes.findFirst({
      select: { type_id: true },
      where: { type_name: subjectTypeName },
    });

    let aCurrentSubClass;

    if (studentSubClass) {
      aCurrentSubClass = await prisma.subClasses.findFirst({
        select: { subclass_id: true },
        where: {
          subclass_name: studentSubClass,
          class_id: aCurrentClass.class_id,
        },
      });
    }

    // Seed Subject
    await prisma.subjects.create({
      data: {
        subject_name: subjectName,
        class_id: aCurrentClass.class_id,
        subject_type: subjectType.type_id,
        subject_teacher: aCurrentStaff.user_id,
        subclass_id: aCurrentSubClass ? aCurrentSubClass.subclass_id : null,
      },
    });
  } catch (error) {
    console.error(`Error seeding student subjects... ${error}`);
  }
}

async function seed() {
  try {
    // await seedClasses();
    // await seedSubClasses();
    // await seedStaffRoles();
    // await seedAdminStudentUser();
    // await seedAdminStaffUser();
    // await retrieveMultipleData();
    // await seedSubjectTypes();
    // await seedSubjects(
    //   "admin.staff",
    //   "Optional",
    //   "SSS One",
    //   "Science Administration",
    //   "Science"
    console.log("All data seeded successfully!");
  } catch (error) {
    console.error(`Error during seeding`);
    console.error(error);
  } finally {
    await prisma.$disconnect;
  }
}

seed();
