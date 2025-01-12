import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    console.log("Fetching classes...");

    // Fetch all classes from the database
    const classes = await prisma.classes.findMany();

    // Return the classes as a response
    return NextResponse.json({ classes });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}
