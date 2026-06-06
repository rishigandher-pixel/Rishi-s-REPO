import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { proposals } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import { canCreateProposal } from "@/lib/plan-enforcement";

// GET /api/proposals — List user's proposals
export async function GET(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userProposals = await db
    .select()
    .from(proposals)
    .where(eq(proposals.userId, userId))
    .orderBy(desc(proposals.createdAt));

  return NextResponse.json(userProposals);
}

// POST /api/proposals — Create a new proposal
export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check plan limits
  const { allowed, reason } = await canCreateProposal();
  if (!allowed) {
    return NextResponse.json(
      { error: reason || "Proposal limit reached" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const now = new Date();

    const proposal = {
      id: generateId(),
      userId,
      title: body.title || "Untitled Proposal",
      clientName: body.clientName || null,
      clientEmail: body.clientEmail || null,
      clientCompany: body.clientCompany || null,
      templateId: body.templateId || null,
      status: "draft" as const,
      content: body.content || null,
      aiGenerated: body.aiGenerated || false,
      totalAmount: body.totalAmount || null,
      currency: body.currency || "USD",
      shareToken: null,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.insert(proposals).values(proposal).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Create proposal error:", error);
    return NextResponse.json(
      { error: "Failed to create proposal" },
      { status: 500 }
    );
  }
}