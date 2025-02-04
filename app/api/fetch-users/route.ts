import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    console.log("Fetching counts...");

    const users = await prisma.users.findMany({
      where: {
        OR: [
          { StaffDetails: { is_active: true } },
          { StudentDetails: { is_active: true } },
        ],
      },
      include: { StaffDetails: true, StudentDetails: true },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
