/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { PLAN_TYPE } from "@/constants/pricing-plans";


export async function POST(req: Request) {
  const body = await req.arrayBuffer();
  const buf = Buffer.from(body); // Convert ArrayBuffer to Buffer
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("Missing Stripe signature");
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Wbhook Error: ${err?.message}`, { status: 500 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId) {
      return new NextResponse("User is required", { status: 400 });
    }

    try {
      await prisma.subscription.create({
        data: {
          userId: +session.metadata.userId,
          plan: PLAN_TYPE.PRO,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
    } catch (error) {
      return new NextResponse("Failed to create subscription", { status: 500 });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    try {
      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          plan: PLAN_TYPE.PRO,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
    } catch (error) {
      return new NextResponse("Failed to update subscription", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
