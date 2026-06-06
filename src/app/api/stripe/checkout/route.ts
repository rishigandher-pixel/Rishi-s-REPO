import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { priceId, planTier } = await req.json();

    // Validate plan
    const plan = planTier === "pro" ? STRIPE_PLANS.pro : STRIPE_PLANS.starter;
    if (priceId && priceId !== plan.priceId) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
    }

    // Get user email from Clerk
    const clerkRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });
    const clerkUser = await clerkRes.json();
    const email = clerkUser?.email_addresses?.[0]?.email_address;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        userId,
        priceId: plan.priceId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
      success_url: `${req.headers.get("origin") || "http://localhost:3000"}/dashboard?checkout=success`,
      cancel_url: `${req.headers.get("origin") || "http://localhost:3000"}/#pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}