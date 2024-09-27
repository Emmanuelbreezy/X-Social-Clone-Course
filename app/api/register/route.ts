import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prismadb";
import { signUpSchema } from "@/lib/validation/auth-validate";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, username, name, password, dateOfBirth } =
      await signUpSchema.parseAsync(body);

    const parsedDateOfBirth = new Date(dateOfBirth);
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        dateOfBirth: parsedDateOfBirth,
        hashedPassword,
      },
    });
    return NextResponse.json(
      {
        data: user,
        message: "Registered successfully",
        status: "success",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Registration failed",
        status: "error",
      },
      { status: 400 }
    );
  }
}

// export async function PUT(request: Request) {}

// export async function DELETE(request: Request) {}
