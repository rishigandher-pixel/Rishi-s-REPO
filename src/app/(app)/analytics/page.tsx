import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function AnalyticsPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  return (
    <>
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex-shrink-0"><h2 className="text-xl font-bold text-slate-900">Analytics</h2></header>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["Proposal Views", "Acceptance Rate", "Avg. Deal Size", "Response Time"].map((m) => (
            <div key={m} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{m}</div>
              <div className="text-3xl font-bold text-slate-900">—</div>
              <div className="text-xs text-slate-400 mt-1">Data appears after sending proposals.</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}