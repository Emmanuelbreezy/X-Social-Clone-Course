"use server";

import { prisma } from "@/lib/prismadb";

export async function checkUsername(username: string, fullname: string) {
  try {
    if (!username) {
      return { message: "Username is required" };
    }
    const user = await prisma.user.findUnique({
      where: { username },
    });

    console.log(username, fullname);

    const isAvailable = !user;

    return { available: isAvailable };
  } catch (error) {
    console.error("Error checking username availability:", error);
    return { message: "error occured" };
  }
}
