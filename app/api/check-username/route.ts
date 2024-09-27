import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { message: "Username is required" },
      { status: 400 }
    );
  }

  try {
    // Query the database to check if the username exists
    const user = await prisma.user.findUnique({
      where: { username: username },
      select: {
        id: true,
        username: true,
      },
    });

    // Check if the username is available
    if (!user) {
      return NextResponse.json({ isAvailable: true });
    }

    return NextResponse.json({ isAvailable: false });
  } catch (error) {
    console.error("Error checking username availability:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
