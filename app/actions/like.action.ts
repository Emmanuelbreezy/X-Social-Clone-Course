"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export async function likePost(postId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not signed in");
  }
  try {
    const currentUserId = +session?.user?.id;

    const user = await prisma.user.findUnique({
      where: {
        id: currentUserId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!postId) {
      throw new Error("Post Id is required");
    }
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    let updatedLikeIds = [...(post.likedIds || [])];

    if (updatedLikeIds.includes(currentUserId)) {
      updatedLikeIds = updatedLikeIds.filter(
        (likeId) => likeId !== currentUserId
      );
    } else {
      updatedLikeIds.push(currentUserId);
      try {
        await prisma.$transaction([
          prisma.notification.create({
            data: {
              body: `${user?.name} liked your post`,
              userId: post.userId,
            },
          }),
          prisma.user.update({
            where: { id: post.userId },
            data: { hasNotification: true },
          }),
        ]);
      } catch (err) {
        console.error("Error creating notification or updating user:", err);
      }
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },

      data: {
        likedIds: updatedLikeIds,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    // if (post?.userId && !updatedLikeIds.includes(currentUserId)) {
    //   try {
    //     await prisma.$transaction([
    //       prisma.notification.create({
    //         data: {
    //           body: `liked your post`,
    //           userId: currentUserId,
    //         },
    //       }),
    //       prisma.user.update({
    //         where: { id: post.userId },
    //         data: { hasNotification: true },
    //       }),
    //     ]);
    //   } catch (err) {
    //     console.error("Error creating notification or updating user:", err);
    //   }
    // }
    const isLiked = updatedPost.likedIds.includes(currentUserId);

    revalidatePath("/home");
    revalidatePath("/notifications");
    revalidatePath(`/${updatedPost?.user?.username}/post/${updatedPost.id}`);

    return {
      isLiked,
      updatedPost,
    };
  } catch (err) {
    console.log(err, "update");
    throw err;
  }
}
