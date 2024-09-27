import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { auth } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Not authenticated", status: "error" },
        { status: 401 }
      );
    }
    const { name, username, bio, profileImage, coverImage } =
      await request.json();

    if (!name || !username) {
      return NextResponse.json(
        { message: "Missing Field: name,username", status: "error" },
        { status: 400 }
      );
    }
    const userId = session?.user?.id;
    const updateUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        name,
        username,
        bio,
        profileImage,
        coverImage,
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
      },
    });

    return NextResponse.json(
      {
        data: updateUser,
        message: "Update user successfully",
        status: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Update user failed",
        status: "error",
      },
      { status: 400 }
    );
  }
}
