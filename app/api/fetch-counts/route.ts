import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    console.log("Fetching counts...");

    const studentUsersCount = await prisma.studentDetails.count({
      where: { is_active: true },
    });
    const staffDetailsCount = await prisma.staffDetails.count({
      where: { is_active: true },
    });
    const totalUsersCount = studentUsersCount + staffDetailsCount;

    const counts = {
      usersCount: totalUsersCount,
      studentsCount: studentUsersCount,
      staffsCount: staffDetailsCount,
    };

    return NextResponse.json({ counts });
  } catch (error) {
    console.error("Error fetching counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch counts" },
      { status: 500 }
    );
  }
}
