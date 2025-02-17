import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { is_student, class_id } = body;

    let users;

    if (is_student == undefined) {
      users = await prisma.users.findMany({
        where: {
          OR: [
            { StaffDetails: { is_active: true } },
            { StudentDetails: { is_active: true } },
          ],
        },
        include: { StaffDetails: true, StudentDetails: true },
      });
    } else if (is_student != undefined && class_id == undefined) {
      users = await prisma.users.findMany({
        where: {
          is_student,
          OR: [
            { StaffDetails: { is_active: true } },
            { StudentDetails: { is_active: true } },
          ],
        },
        include: { StaffDetails: true, StudentDetails: true },
      });
    } else if (is_student && class_id != undefined) {
      users = await prisma.users.findMany({
        where: {
          is_student,
          StudentDetails: { class_id: class_id },
          OR: [
            { StaffDetails: { is_active: true } },
            { StudentDetails: { is_active: true } },
          ],
        },
        include: { StaffDetails: true, StudentDetails: true },
      });
    } else {
      throw new Error(
        "There is an issue with the parameters passed. Try again!"
      );
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
