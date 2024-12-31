import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    console.log("Running...");
    // Extract user ID from the request (e.g., via query params, headers, etc.)
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch staff roles with details
    const staffRolesWithDetails = await prisma.staffUserRoles.findMany({
      where: { staff_id: userId },
      include: {
        StaffRoles: true, // Fetch related StaffRoles
      },
    });

    // Extract role names
    const roleNames = staffRolesWithDetails
      .map((staffRole) => staffRole.StaffRoles?.role_name) // Optional chaining for safety
      .filter((roleName) => roleName !== undefined); // Filter out undefined values

    // Return role names as a response
    return NextResponse.json({ roleNames });
  } catch (error) {
    console.error("Error fetching staff roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff roles" },
      { status: 500 }
    );
  }
}
