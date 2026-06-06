import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getUserPlan, canCreateProposal } from "@/lib/plan-enforcement";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getUserPlan();
  const proposalCheck = await canCreateProposal();

  return NextResponse.json({
    tier: plan.tier,
    limits: plan.limits,
    canCreate: proposalCheck.allowed,
    reason: proposalCheck.reason || null,
  });
}