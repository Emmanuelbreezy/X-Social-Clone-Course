"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

export async function updateBirthday(dateOfBirth: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not signed in");
  }
  try {
    const currentUserId = +session?.user?.id;

    if (!dateOfBirth) {
      return {
        status: "error",
        message: "Date of Birth is required",
      };
    }

    const parsedDateOfBirth = new Date(dateOfBirth);

    await prisma.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        dateOfBirth: parsedDateOfBirth,
      },
    });

    return {
      message: "updated birthday successfully",
    };
  } catch (err) {
    console.log(err, "update");
    throw err;
  }
}
