import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    console.log("Fetching roles...");

    // Fetch all roles from the database
    const roles = await prisma.staffRoles.findMany({
      select: { role_id: true, role_name: true }, // Adjust fields based on your database schema
    });

    // Return the roles as a response
    return NextResponse.json({ roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}
