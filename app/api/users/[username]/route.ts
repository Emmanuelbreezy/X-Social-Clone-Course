/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(request: NextRequest, context: any) {
  const { params } = context;
  try {
    const username = params.username;

    if (!username) {
      return NextResponse.json(
        { message: "Invalid username", status: "error" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
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

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found", status: "error" },
        { status: 404 }
      );
    }

    const followersCount = await prisma.user.count({
      where: {
        followingIds: {
          has: existingUser.id,
        },
      },
    });
    return NextResponse.json({
      message: "User retrieved successfully",
      status: "success",
      data: { ...existingUser, followersCount },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to retrieve data",
        status: "error",
      },
      { status: 400 }
    );
  }
}
