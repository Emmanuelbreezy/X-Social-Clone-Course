/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { postSchema } from "@/lib/validation/post-validate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated", status: "error" },
        { status: 401 }
      );
    }
    const userId = session?.user?.id;
    const requestBody = await request.json();

    const { body, postImage } = await postSchema.parseAsync(requestBody);
    const post = await prisma.post.create({
      data: {
        body,
        postImage,
        userId: +userId,
      },
    });
    return NextResponse.json(
      {
        data: post,
        message: "Post created successfully",
        status: "success",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to create post",
        status: "error",
      },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const userId = searchParams.get("userId");

    let posts;

    if (userId) {
      posts = await prisma.post.findMany({
        where: {
          userId: +userId,
        },
        include: {
          user: {
            select: {
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
          },
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      posts = await prisma.post.findMany({
        include: {
          user: {
            select: {
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
          },
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json({
      status: "success",
      posts,
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
