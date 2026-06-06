import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { users, proposals } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

const PLAN_LIMITS = {
  free: { proposalsPerMonth: 2 },
  starter: { proposalsPerMonth: 5 },
  pro: { proposalsPerMonth: Infinity },
} as const;

export type PlanTier = keyof typeof PLAN_LIMITS;

/**
 * Get the current user's plan tier
 */
export async function getUserPlan(): Promise<{
  tier: PlanTier;
  limits: { proposalsPerMonth: number };
}> {
  const { userId } = auth();
  if (!userId) {
    return { tier: "free", limits: PLAN_LIMITS.free };
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const tier = (user[0]?.planTier as PlanTier) || "free";
  return { tier, limits: PLAN_LIMITS[tier] || PLAN_LIMITS.free };
}

/**
 * Check if the current user can create a new proposal
 * Returns { allowed: boolean, reason?: string }
 */
export async function canCreateProposal(): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  const { userId } = auth();
  if (!userId) {
    return { allowed: false, reason: "Not authenticated" };
  }

  const plan = await getUserPlan();

  if (plan.limits.proposalsPerMonth === Infinity) {
    return { allowed: true };
  }

  // Count proposals created this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(proposals)
    .where(
      and(
        eq(proposals.userId, userId),
        sql`${proposals.createdAt} >= ${startOfMonth}`
      )
    );

  const proposalCount = Number(count[0]?.count || 0);

  if (proposalCount >= plan.limits.proposalsPerMonth) {
    return {
      allowed: false,
      reason: `You've reached your ${plan.tier} plan limit of ${plan.limits.proposalsPerMonth} proposals per month. Upgrade to Pro for unlimited proposals.`,
    };
  }

  return { allowed: true };
}