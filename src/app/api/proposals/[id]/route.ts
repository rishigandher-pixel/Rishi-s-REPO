import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { proposals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET /api/proposals/[id] — Get a specific proposal
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const proposal = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, params.id))
    .limit(1);

  if (!proposal.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(proposal[0]);
}

// PATCH /api/proposals/[id] — Update a proposal
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const now = new Date();

    const result = await db
      .update(proposals)
      .set({
        ...body,
        updatedAt: now,
      })
      .where(eq(proposals.id, params.id))
      .returning();

    if (!result.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Update proposal error:", error);
    return NextResponse.json(
      { error: "Failed to update proposal" },
      { status: 500 }
    );
  }
}

// DELETE /api/proposals/[id] — Delete a proposal
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await db
      .delete(proposals)
      .where(eq(proposals.id, params.id))
      .returning();

    if (!result.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete proposal error:", error);
    return NextResponse.json(
      { error: "Failed to delete proposal" },
      { status: 500 }
    );
  }
}