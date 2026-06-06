import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { proposals } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Plus, MoreVertical, Search } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-800",
  sent: "bg-blue-100 text-blue-800",
  viewed: "bg-indigo-100 text-indigo-800",
  accepted: "bg-emerald-100 text-emerald-800",
  declined: "bg-red-100 text-red-800",
};

export const dynamic = "force-dynamic";

export default async function ProposalsPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const userProposals = await db
    .select()
    .from(proposals)
    .where(eq(proposals.userId, userId))
    .orderBy(desc(proposals.createdAt));

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-bold text-slate-900">Proposals</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search proposals..." className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition w-64 outline-none" />
          </div>
          <Link href="/proposals/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New Proposal</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center gap-4 mb-6">
          {["All", "Draft", "Sent", "Viewed", "Accepted", "Declined"].map((f) => (
            <button key={f} className={`text-sm font-medium px-4 py-2 rounded-lg transition ${f === "All" ? "bg-indigo-100 text-indigo-700" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}>{f}</button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {userProposals.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No proposals yet</h3>
              <p className="text-sm text-slate-500 mb-6">Create your first proposal and start winning clients.</p>
              <Link href="/proposals/new" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                <Plus className="w-4 h-4" /> Create Proposal
              </Link>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Client / Project</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userProposals.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition cursor-pointer group">
                    <td className="px-6 py-4">
                      <Link href={`/proposals/${p.id}/edit`} className="block">
                        <div className="font-bold text-slate-900">{p.clientName || p.title || "Untitled"}</div>
                        <div className="text-xs text-slate-500">{p.clientName ? p.title : "Click to edit"}</div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {p.totalAmount ? `$${p.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[p.status || "draft"]}`}>
                        {p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-500">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/proposals/${p.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}