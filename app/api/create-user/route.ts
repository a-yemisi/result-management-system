import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      username,
      password,
      is_student,
      first_name,
      last_name,
      class_id,
      subclass_id,
      parent_email,
      hire_date,
      staff_roles,
    } = body;

    // Validate input
    if (!username || !password || !first_name || !last_name) {
      return NextResponse.json(
        {
          error: "Username, password, first name, and last name are required.",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.users.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Create the user
      const user = await prisma.users.create({
        data: {
          username,
          password_hash: hashedPassword,
          is_student,
          first_name,
          last_name,
        },
      });

      // Conditionally add details to the respective table
      if (is_student) {
        if (!class_id || !parent_email) {
          throw new Error("Classes and Parent email are required.");
        }

        await prisma.studentDetails.create({
          data: {
            student_id: user.user_id, // Use user_id as the foreign key
            class_id,
            subclass_id,
            parent_email,
          },
        });
      }
      if (!is_student) {
        if (!hire_date || !staff_roles || staff_roles.length === 0) {
          throw new Error("Hire date is required, or no staff roles selected.");
        }

        await prisma.staffDetails.create({
          data: {
            staff_id: user.user_id,
            is_active: true,
            hire_date,
          },
        });
        const staffRoles = staff_roles.map((role: number) => ({
          staff_id: user.user_id,
          role_id: role,
        }));
        await prisma.staffUserRoles.createMany({
          data: staffRoles,
          skipDuplicates: true,
        });
      }

      return user;
    });

    return NextResponse.json({ success: true, user: result });
  } catch (error) {
    console.error(`Error creating user: ${error}`);
    return NextResponse.json({ error: `DB Error: ${error}` }, { status: 500 });
  }
}
