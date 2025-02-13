import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const userSchema = z.object({
  user_id: z.string().min(1, "User ID is required"),
  username: z.string().min(1, "Username is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  is_student: z.boolean(),
  class_id: z.number().optional(),
  subclass_id: z.number().optional(),
  parent_email: z.string().email().optional(),
  hire_date: z.string().optional(),
  staff_roles: z.array(z.number()).optional(),
});

interface UserRequestBody {
  user_id: string;
  username: string;
  is_student: boolean;
  first_name: string;
  last_name: string;
  class_id?: number;
  subclass_id?: number;
  parent_email?: string;
  hire_date?: string;
  staff_roles?: number[];
}

const updateUserDetails = async (prisma: any, username: string, data: any) => {
  return prisma.users.update({
    where: { username },
    data,
  });
};

const updateStudentDetails = async (
  prisma: any,
  user_id: number,
  data: any
) => {
  return prisma.studentDetails.update({
    where: { student_id: user_id },
    data,
  });
};

const updateStaffDetails = async (prisma: any, user_id: number, data: any) => {
  await prisma.staffDetails.update({
    where: { staff_id: user_id },
    data: { hire_date: data.hire_date },
  });

  await prisma.staffUserRoles.deleteMany({
    where: { staff_id: user_id },
  });

  const staffRoles = data.staff_roles.map((role: number) => ({
    staff_id: user_id,
    role_id: role,
  }));

  await prisma.staffUserRoles.createMany({
    data: staffRoles,
    skipDuplicates: true,
  });
};

export async function POST(req: Request) {
  try {
    const body: UserRequestBody = await req.json();
    const validation = userSchema.safeParse(body);

    if (!validation.success) {
      console.log("Validation failed");
      console.error(validation.error.errors);
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const {
      user_id,
      username,
      is_student,
      first_name,
      last_name,
      class_id,
      subclass_id,
      parent_email,
      hire_date,
      staff_roles,
    } = validation.data;

    const existingUser = await prisma.users.findUnique({
      where: { user_id },
    });

    if (!existingUser) {
      throw new Error("User does not exist");
    }

    if (username !== existingUser.username) {
      const usernameExists = await prisma.users.findUnique({
        where: { username: username },
      });
      if (usernameExists) {
        throw new Error("Username Exists!");
      }
    }

    const result = await prisma.$transaction(async (prisma) => {
      const user = await updateUserDetails(prisma, username, {
        username,
        is_student,
        first_name,
        last_name,
      });

      if (is_student) {
        if (!class_id || !parent_email) {
          throw new Error(
            "Class ID and parent email are required for students."
          );
        }
        await updateStudentDetails(prisma, user.user_id, {
          class_id,
          subclass_id,
          parent_email,
        });
      } else {
        if (!hire_date || !staff_roles || staff_roles.length === 0) {
          throw new Error("Hire date and staff roles are required for staff.");
        }
        await updateStaffDetails(prisma, user.user_id, {
          hire_date,
          staff_roles,
        });
      }

      return user;
    });

    return NextResponse.json({ success: true, data: { user: result } });
  } catch (error) {
    console.error(`Error updating user: ${error}`);
    return NextResponse.json(
      { error: `An error occurred while updating the user. ${error}` },
      { status: 500 }
    );
  }
}
