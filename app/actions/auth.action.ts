/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

export async function doSocialLogin(formData: any) {
  const action = formData.get("action");
  await signIn(action, { redirectTo: "/home" });
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}

export async function doCredentialLogin(data: {
  email: string;
  password: string;
}) {
  try {
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
    });
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function ensureUniqueUsername(username: string) {
  try {
    let user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    while (user) {
      const randomNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
      username = `${username}${randomNumber}`;
      user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
    }
    return username;
  } catch (err) {
    throw err;
  }
}
