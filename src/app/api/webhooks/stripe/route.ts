import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, getPlanByPriceId } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const priceId = session.metadata?.priceId;

        if (!userId || !priceId || !session.customer) {
          throw new Error("Missing metadata or customer");
        }

        const planInfo = getPlanByPriceId(priceId);
        if (!planInfo) throw new Error("Unknown price ID");

        const now = new Date();
        const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Check if user exists, if not insert
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (existingUser.length === 0) {
          // Create user record (should already exist from Clerk webhook)
          console.warn("User not found for checkout:", userId);
        }

        // Update user's subscription info
        await db
          .update(users)
          .set({
            stripeCustomerId: session.customer as string,
            subscriptionId: session.subscription as string,
            subscriptionStatus: "active",
            planTier: planInfo.key as "starter" | "pro",
            updatedAt: now,
          })
          .where(eq(users.id, userId));

        // Create subscription record
        const subId = session.subscription as string;
        const existingSub = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.id, subId))
          .limit(1);

        if (existingSub.length === 0) {
          await db.insert(subscriptions).values({
            id: subId,
            userId,
            stripeCustomerId: session.customer as string,
            status: "active",
            planTier: planInfo.key as "starter" | "pro",
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            createdAt: now,
            updatedAt: now,
          });
        }

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (!userId) {
          console.warn("No userId in subscription metadata, looking up by customer...");
          // Fallback: find user by stripe customer ID
          const user = await db
            .select()
            .from(users)
            .where(eq(users.stripeCustomerId, subscription.customer as string))
            .limit(1);
          if (user.length > 0) {
            await db
              .update(users)
              .set({
                subscriptionStatus: subscription.status as any,
                updatedAt: new Date(),
              })
              .where(eq(users.id, user[0].id));

            await db
              .update(subscriptions)
              .set({
                status: subscription.status as any,
                currentPeriodStart: subscription.current_period_start
                  ? new Date(subscription.current_period_start * 1000)
                  : undefined,
                currentPeriodEnd: subscription.current_period_end
                  ? new Date(subscription.current_period_end * 1000)
                  : undefined,
                updatedAt: new Date(),
              })
              .where(eq(subscriptions.id, subscription.id));
          }
        } else {
          await db
            .update(users)
            .set({
              subscriptionStatus: subscription.status as any,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));

          await db
            .update(subscriptions)
            .set({
              status: subscription.status as any,
              currentPeriodStart: subscription.current_period_start
                ? new Date(subscription.current_period_start * 1000)
                : undefined,
              currentPeriodEnd: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000)
                : undefined,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, subscription.id));
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;
        
        // Update the subscription period end
        if (invoice.subscription) {
          const stripeSub = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );
          
          await db
            .update(subscriptions)
            .set({
              currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
              currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
              status: "active",
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, stripeSub.id));
        }
        break;
      }

      case "invoice.payment_failed": {
        const failedInvoice = event.data.object;
        const failedCustomerId = failedInvoice.customer as string;

        const user = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, failedCustomerId))
          .limit(1);

        if (user.length > 0) {
          await db
            .update(users)
            .set({
              subscriptionStatus: "past_due",
              updatedAt: new Date(),
            })
            .where(eq(users.id, user[0].id));
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}