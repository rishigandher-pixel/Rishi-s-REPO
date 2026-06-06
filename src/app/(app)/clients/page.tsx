import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function ClientsPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  return (
    <>
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex-shrink-0"><h2 className="text-xl font-bold text-slate-900">Clients</h2></header>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Client Management</h3>
          <p className="text-sm text-slate-500">Track and manage your client relationships. Coming soon.</p>
        </div>
      </div>
    </>
  );
}