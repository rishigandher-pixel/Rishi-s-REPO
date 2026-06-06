import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ProposalEditor from "@/components/ProposalEditor";

export default function NewProposalPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="h-full">
      <ProposalEditor />
    </div>
  );
}