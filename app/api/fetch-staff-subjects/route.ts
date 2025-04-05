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

    const subjectNames = await prisma.subjects.findMany({
      select: {
        subject_name: true,
        Classes: {
          select: {
            class_name: true,
          },
        },
      },
      where: { subject_teacher: userId },
    });

    // Return the classes as a response
    return NextResponse.json({ subjectNames });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
