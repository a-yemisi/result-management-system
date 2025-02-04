import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("Deleting user");
    const body = await req.json();
    const { user_id, graduation_status } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: {
        user_id: user_id,
        OR: [
          { StaffDetails: { is_active: true } },
          { StudentDetails: { is_active: true } },
        ],
      },
      include: { StaffDetails: true, StudentDetails: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User Not Found!" }, { status: 400 });
    }

    if (user.is_student && user.StudentDetails) {
      await prisma.studentDetails.update({
        where: { student_id: user_id },
        data: {
          is_active: false,
          graduated: graduation_status,
          deactivated_at: new Date(),
        },
      });
      console.log("Student deactivated");
    } else if (!user.is_student && user.StaffDetails) {
      await prisma.staffDetails.update({
        where: { staff_id: user_id },
        data: { is_active: false, deactivated_at: new Date() },
      });
      console.log("Staff deactivated");
    } else {
      return NextResponse.json(
        { error: "No matching student or staff details found" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "User deactivated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching staff roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff roles" },
      { status: 500 }
    );
  }
}
