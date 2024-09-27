import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const query = searchParams.get("q");
    const filter = searchParams.get("f");

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated", status: "error" },
        { status: 401 }
      );
    }

    const currentUserId = +session?.user?.id;

    // Validate if query exists
    if (!query) {
      return NextResponse.json(
        {
          message: "Query parameter 'q' is required",
          status: "error",
        },
        { status: 400 }
      );
    }

    if (filter === "user") {
      // Search for users excluding the current user
      const users = await prisma.user.findMany({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { username: { contains: query, mode: "insensitive" } },
                { bio: { contains: query, mode: "insensitive" } },
              ],
            },
            { id: { not: currentUserId } }, // Exclude the current user
          ],
        },
        select: {
          id: true,
          name: true,
          username: true,
          bio: true,
          email: true,
          dateOfBirth: true,
          emailVerified: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
          followingIds: true,
          isVerified: true,
          subscription: {
            select: {
              plan: true,
            },
          },
        },
      });

      return NextResponse.json({
        status: "success",
        users,
      });
    } else {
      // Search for posts excluding the current user's posts
      const posts = await prisma.post.findMany({
        where: {
          AND: [
            {
              OR: [{ body: { contains: query, mode: "insensitive" } }],
            },
            // { userId: { not: currentUserId } }, // Exclude posts by the current user
          ],
        },
        include: {
          user: {
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
              isVerified: true,
              subscription: {
                select: {
                  plan: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({
        status: "success",
        posts,
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      {
        message: "Failed to retrieve data",
        status: "error",
      },
      { status: 400 }
    );
  }
}
