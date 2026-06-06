import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { proposals, proposalSections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PreviewPage({
  params,
}: {
  params: { token: string };
}) {
  const proposal = await db
    .select()
    .from(proposals)
    .where(eq(proposals.shareToken, params.token))
    .limit(1);

  if (!proposal.length || proposal[0].status === "draft") {
    notFound();
  }

  const p = proposal[0];
  let sections: any[] = [];

  try {
    if (p.content) {
      sections = typeof p.content === "string" ? JSON.parse(p.content) : p.content;
    }
  } catch {
    sections = [];
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-12">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-sm overflow-hidden">
        {/* Brand bar */}
        <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600" />

        {/* Header */}
        <header className="p-8 md:p-12 border-b border-gray-100 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm" />
              </div>
              <span className="text-lg font-bold">PitchStudio</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {p.title}
            </h1>
            <p className="text-gray-500">
              Prepared for{" "}
              <span className="text-gray-900 font-medium">
                {p.clientName || "Valued Client"}
              </span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">
              Date
            </div>
            <div className="font-medium text-gray-900">
              {p.createdAt
                ? formatDate(new Date(p.createdAt))
                : "Present"}
            </div>
          </div>
        </header>

        {/* Sections */}
        <div className="p-8 md:p-12 space-y-10">
          {sections.length > 0 ? (
            sections.map((section: any, i: number) => (
              <section key={section.id || i}>
                <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">
                  {section.title || `Section ${i + 1}`}
                </h2>
                <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {section.content || "Content pending..."}
                </div>
              </section>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>Proposal content is being prepared.</p>
            </div>
          )}

          {/* Pricing Summary */}
          {p.totalAmount && (
            <section className="border-t border-gray-100 pt-8">
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">
                Investment Summary
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total Investment
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(p.totalAmount, p.currency || "USD")}
                  </span>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-100 p-8 md:p-12 text-center text-sm text-gray-400">
          <p>
            Generated with{" "}
            <span className="text-indigo-600 font-medium">PitchStudio</span>
          </p>
        </footer>
      </div>
    </div>
  );
}