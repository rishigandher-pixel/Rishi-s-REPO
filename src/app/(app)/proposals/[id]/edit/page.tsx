import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { proposals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ProposalEditor from "@/components/ProposalEditor";

export const dynamic = "force-dynamic";

export default async function EditProposalPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const proposal = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, params.id))
    .limit(1);

  if (!proposal.length || proposal[0].userId !== userId) {
    notFound();
  }

  return (
    <div className="h-full">
      <ProposalEditor proposalId={params.id} />
    </div>
  );
}