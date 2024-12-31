const { PrismaClient, Users, StaffUserRoles } = require("@prisma/client");
const bcrypt = require("bcrypt");

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

async function seed() {
  try {
    // await seedClasses();
    // await seedSubClasses();
    // await seedStaffRoles();
    // await seedAdminStudentUser();
    await seedAdminStaffUser();
    // await retrieveMultipleData();
    console.log("All data seeded successfully!");
  } catch (error) {
    console.error(`Error during seeding: ${error}`);
  } finally {
    await prisma.$disconnect;
  }
}

seed();
