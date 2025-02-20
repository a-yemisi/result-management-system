import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Define schema using Zod
const userSchema = z.object({
  username: z
    .string()
    .min(3, " Username must be at least 3 characters long")
    .refine((val) => val.includes("."), {
      message: "Username must include a '.' (dot)",
    }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  is_student: z.boolean(),

  // Student-specific fields
  class_id: z.number(),
  subclass_id: z.number().optional(),
  parent_email: z.string().email("Invalid parent email format").optional(),

  // Staff-specific fields
  hire_date: z.string().optional(),
  staff_roles: z.array(z.number()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = userSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        {
          error: "Validation Failed",
          details: Object.values(parsedData.error.flatten().fieldErrors)
            .flat()
            .filter(Boolean),
        }, // Returns structured validation errors
        { status: 400 }
      );
    }

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
    } = parsedData.data;

    // Check if username already exists
    const existingUser = await prisma.users.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new Error("User already exist!");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start transaction
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.users.create({
        data: {
          username,
          password_hash: hashedPassword,
          is_student,
          first_name,
          last_name,
        },
      });

      // Handle Student Details
      if (is_student) {
        if (!class_id || !parent_email) {
          throw new Error(
            "Class ID and Parent Email are required for students."
          );
        }

        await prisma.studentDetails.create({
          data: {
            student_id: user.user_id,
            class_id,
            subclass_id,
            parent_email,
          },
        });
      }

      // Handle Staff Details
      if (!is_student) {
        if (!hire_date || !staff_roles || staff_roles.length === 0) {
          throw new Error(
            "Hire date and at least one staff role are required."
          );
        }

        await prisma.staffDetails.create({
          data: {
            staff_id: user.user_id,
            is_active: true,
            hire_date,
          },
        });

        await prisma.staffUserRoles.createMany({
          data: staff_roles.map((role) => ({
            staff_id: user.user_id,
            role_id: role,
          })),
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
