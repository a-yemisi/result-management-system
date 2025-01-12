import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, is_student, first_name, last_name } = body;
    console.log(
      `Username: ${username} Password: ${password}, IsStudent: ${is_student}`
    );
    if (!username || !password) {
      console.log("Running no password");
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.users.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        username,
        password_hash: hashedPassword,
        is_student,
        first_name,
        last_name,
      },
    });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(`Error creating user: ${error}`);
    return NextResponse.json(
      { error: "Failed to create user." },
      { status: 500 }
    );
  }
}
