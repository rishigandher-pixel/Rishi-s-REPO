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

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const userProposals = await db
    .select()
    .from(proposals)
    .where(eq(proposals.userId, userId))
    .orderBy(desc(proposals.createdAt))
    .limit(20);

  const totalActive = userProposals.filter(
    (p) => p.status === "draft" || p.status === "sent"
  ).length;
  const pendingView = userProposals.filter((p) => p.status === "sent").length;
  const accepted = userProposals.filter((p) => p.status === "accepted").length;
  const conversionRate =
    userProposals.length > 0
      ? Math.round((accepted / userProposals.length) * 100)
      : 0;

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition w-64 outline-none"
            />
          </div>
          <Link
            href="/proposals/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Proposal</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Active</div>
            <div className="text-2xl font-bold text-slate-900">{totalActive}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pending View</div>
            <div className="text-2xl font-bold text-indigo-600">{pendingView}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Accepted</div>
            <div className="text-2xl font-bold text-emerald-600">{accepted}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Conversion Rate</div>
            <div className="text-2xl font-bold text-slate-900">{conversionRate}%</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-slate-900">Recent Proposals</h3>
            <div className="flex items-center gap-2">
              {["All", "Draft", "Sent", "Accepted"].map((f) => (
                <button key={f} className={`text-xs font-medium px-3 py-1 rounded-full transition ${f === "All" ? "bg-indigo-100 text-indigo-700" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}>{f}</button>
              ))}
            </div>
          </div>

          {userProposals.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No proposals yet</h3>
              <p className="text-sm text-slate-500 mb-6">Create your first proposal and start winning clients.</p>
              <Link href="/proposals/new" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                <Plus className="w-4 h-4" />
                Create Proposal
              </Link>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Client / Project</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Activity</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userProposals.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{p.clientName || "Unknown Client"}</div>
                      <div className="text-xs text-slate-500">{p.title}</div>
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
                        {p.updatedAt ? timeAgo(new Date(p.updatedAt)) : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 p-1 rounded"><MoreVertical className="w-5 h-5" /></button>
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

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}