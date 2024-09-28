"use server";
import { PLAN_TYPE } from "@/constants/pricing-plans";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

const DAY_IN_MS = 86_400_000; // 1day in milliseconds

export async function checkUserSubscription() {
  try {
    const session = await auth();
    if (!session?.user?.id) return;

    const currentUserId = +session?.user?.id;
    // Fetch subscription and plan details for the user
    const userSubscription = await prisma.subscription.findUnique({
      where: {
        userId: currentUserId,
      },
      select: {
        plan: true,
        stripeSubscriptionId: true,
        stripeCurrentPeriodEnd: true,
        stripeCustomerId: true,
        stripePriceId: true,
      },
    });

    // If no subscription found, return free plan
    if (!userSubscription || !userSubscription.plan) {
      return PLAN_TYPE.FREE;
    }

    // Check if the user has a "pro" plan and if it's valid
    const isProPlanValid =
      userSubscription.plan === PLAN_TYPE.PRO &&
      userSubscription.stripePriceId &&
      userSubscription.stripeCurrentPeriodEnd && // Ensure currentPeriodEnd is not null or undefined
      userSubscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS >
        Date.now(); // Check if current period end + 1 day is still in the future

    // Return "pro plan" if valid, otherwise return "free plan"
    return isProPlanValid ? PLAN_TYPE.PRO : PLAN_TYPE.FREE;
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw new Error("dynamic server error: ");
    }
    console.log(error);
    throw new Error("error occurred while");
  }
}
