import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ tier: "free", status: null });
    }

    const sub = user[0].subscriptionId
      ? await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.id, user[0].subscriptionId!))
          .limit(1)
      : [];

    return NextResponse.json({
      tier: user[0].planTier || "free",
      status: user[0].subscriptionStatus,
      stripeCustomerId: user[0].stripeCustomerId,
      subscription: sub[0] || null,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ tier: "free", status: null });
  }
}