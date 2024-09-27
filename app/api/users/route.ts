import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated", status: "error" },
        { status: 401 }
      );
    }
    const currentUserEmail = session.user.email;
    const users = await prisma.user.findMany({
      where: {
        email: {
          not: currentUserEmail,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        email: true,
        dateOfBirth: true,
        emailVerified: true,
        coverImage: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
        followingIds: true,
        hasNotification: true,
        isVerified: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    return NextResponse.json({
      message: "Users retrieved successfully",
      status: "success",
      data: users,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to retrieve data",
        status: "error",
      },
      { status: 400 }
    );
  }
}
