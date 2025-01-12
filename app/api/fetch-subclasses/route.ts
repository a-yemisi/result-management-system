import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    console.log("Fetching sub classes...");

    const url = new URL(req.url);
    const classId = url.searchParams.get("classId");

    if (!classId) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }

    // Fetch all roles from the database
    const subClasses = await prisma.subClasses.findMany({
      where: { class_id: Number(classId) },
    });

    // Return the roles as a response
    return NextResponse.json({ subClasses });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}
