"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

export async function getCurrentUser() {
  try {
    const session = await auth();
    if (!session?.user?.email) return null;

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
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

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (err) {
    throw err;
  }
}
