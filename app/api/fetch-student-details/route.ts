import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Fetch all subjects assigned to a teacher

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // const subjectNames = await prisma.subjects.findMany({
    //   select: { subject_name: true },
    //   where: { subject_teacher: userId },
    // });

    const classDetails = await prisma.studentDetails.findFirst({
      select: {
        Class: {
          select: {
            class_name: true,
          },
        },
        SubClass: {
          select: {
            subclass_name: true,
          },
        },
      },
      where: { student_id: userId },
    });

    console.log("This is how class details look like");

    console.log(classDetails);

    // Return the classes as a response
    return NextResponse.json({ classDetails });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
