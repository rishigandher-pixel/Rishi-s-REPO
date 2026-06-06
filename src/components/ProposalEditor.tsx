"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Send,
  Sparkles,
  Plus,
  GripVertical,
  ChevronDown,
  Loader2,
  Check,
  X,
  FileText,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Types
export interface ProposalSection {
  id: string;
  type: string;
  title: string;
  content: string;
  sortOrder: number;
}

export interface ProposalData {
  id?: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  templateId: string;
  totalAmount: string;
  currency: string;
  sections: ProposalSection[];
}

const DEFAULT_SECTIONS: { type: string; title: string; icon: string }[] = [
  { type: "cover", title: "Cover Page", icon: "image" },
  { type: "intro", title: "Introduction", icon: "info" },
  { type: "problem", title: "Problem Statement", icon: "alert" },
  { type: "solution", title: "Our Solution", icon: "lightbulb" },
  { type: "scope", title: "Scope of Work", icon: "clipboard" },
  { type: "timeline", title: "Timeline", icon: "clock" },
  { type: "pricing", title: "Investment", icon: "dollar" },
  { type: "testimonial", title: "Testimonials", icon: "quote" },
  { type: "about", title: "About Us", icon: "users" },
  { type: "cta", title: "Next Steps", icon: "arrow" },
];

const SECTION_LABELS: Record<string, string> = {
  cover: "Cover Page",
  intro: "Introduction",
  problem: "Problem Statement",
  solution: "Our Solution",
  scope: "Scope of Work",
  timeline: "Timeline",
  pricing: "Investment",
  testimonial: "Testimonials",
  about: "About Us",
  cta: "Next Steps",
};

interface ProposalEditorProps {
  proposalId?: string;
}

export default function ProposalEditor({ proposalId }: ProposalEditorProps) {
  const router = useRouter();
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  const [proposal, setProposal] = useState<ProposalData>({
    title: "Untitled Proposal",
    clientName: "",
    clientEmail: "",
    clientCompany: "",
    templateId: "modern",
    totalAmount: "",
    currency: "USD",
    sections: DEFAULT_SECTIONS.map((s, i) => ({
      id: `${s.type}-${Date.now()}-${i}`,
      type: s.type,
      title: s.title,
      content: "",
      sortOrder: i,
    })),
  });

  const [activeSection, setActiveSection] = useState(0);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [proposalIdState, setProposalIdState] = useState<string | undefined>(proposalId);
  const [dirty, setDirty] = useState(false);

  // Auto-save
  const saveProposal = useCallback(async () => {
    if (!dirty) return;
    setSaving(true);
    try {
      const method = proposalIdState ? "PATCH" : "POST";
      const url = proposalIdState
        ? `/api/proposals/${proposalIdState}`
        : "/api/proposals";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: proposal.title,
          clientName: proposal.clientName,
          clientEmail: proposal.clientEmail,
          clientCompany: proposal.clientCompany,
          templateId: proposal.templateId,
          totalAmount: proposal.totalAmount ? parseFloat(proposal.totalAmount) : null,
          currency: proposal.currency,
          content: JSON.stringify(proposal.sections),
          status: "draft",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (!proposalIdState && data.id) {
          setProposalIdState(data.id);
        }
        setLastSaved(new Date());
        setDirty(false);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }, [proposal, proposalIdState, dirty]);

  // Auto-save every 30 seconds if dirty
  useEffect(() => {
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    autoSaveRef.current = setInterval(() => {
      if (dirty) saveProposal();
    }, 30000);
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [dirty, saveProposal]);

  // Update field handlers
  const updateField = (field: string, value: string) => {
    setProposal((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const updateSection = (index: number, content: string) => {
    setProposal((prev) => {
      const sections = [...prev.sections];
      sections[index] = { ...sections[index], content };
      return { ...prev, sections };
    });
    setDirty(true);
  };

  // AI Generation
  const generateWithAI = async (sectionIndex: number) => {
    const section = proposal.sections[sectionIndex];
    setGenerating(section.type);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: section.type,
          context: {
            clientName: proposal.clientName,
            projectTitle: proposal.title,
            industry: "technology",
            expertise: "professional services",
          },
          tone: "professional",
        }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      const data = await res.json();
      updateSection(sectionIndex, data.content);
      toast({ title: `${SECTION_LABELS[section.type] || section.title} generated!`, description: "Review and edit the AI-generated content." });
    } catch (err) {
      toast({ title: "AI generation failed", description: "Please check your API key and try again.", variant: "destructive" });
    } finally {
      setGenerating(null);
    }
  };

  // Add section
  const addSection = () => {
    const newType = "scope";
    const newSection: ProposalSection = {
      id: `${newType}-${Date.now()}`,
      type: newType,
      title: SECTION_LABELS[newType] || newType,
      content: "",
      sortOrder: proposal.sections.length,
    };
    setProposal((prev) => ({ ...prev, sections: [...prev.sections, newSection] }));
    setActiveSection(proposal.sections.length);
    setDirty(true);
  };

  // Remove section
  const removeSection = (index: number) => {
    if (proposal.sections.length <= 1) return;
    setProposal((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
    if (activeSection >= index) setActiveSection(Math.max(0, activeSection - 1));
    setDirty(true);
  };

  // Send proposal
  const sendProposal = async () => {
    await saveProposal();
    if (!proposalIdState) return;
    try {
      const shareToken = Array.from({ length: 24 }, () =>
        "abcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 36))
      ).join("");

      await fetch(`/api/proposals/${proposalIdState}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "sent",
          shareToken,
          sentAt: new Date().toISOString(),
        }),
      });

      const shareUrl = `${window.location.origin}/preview/${shareToken}`;
      toast({
        title: "Proposal sent!",
        description: `Share link: ${shareUrl}`,
      });
    } catch (err) {
      toast({ title: "Failed to send proposal", variant: "destructive" });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/proposals")}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <input
              type="text"
              value={proposal.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="font-bold text-slate-900 border-none p-0 focus:ring-0 w-80 text-lg bg-transparent outline-none"
              placeholder="Proposal Title"
            />
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
              {lastSaved
                ? `Draft • Saved ${timeAgo(lastSaved)}`
                : "New proposal"}
              {saving && " • Saving..."}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Template:</span>
            <select
              value={proposal.templateId}
              onChange={(e) => updateField("templateId", e.target.value)}
              className="text-sm font-semibold text-slate-900 bg-slate-50 border-slate-200 rounded-md py-1.5 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <option value="modern">Modern (Clean)</option>
              <option value="professional">Professional (Formal)</option>
              <option value="creative">Creative (Bold)</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => proposalIdState && router.push(`/preview/${proposalIdState}`)}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={sendProposal}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Proposal
            </button>
          </div>
        </div>
      </header>

      {/* Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Sections */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Proposal Sections
            </div>
            <nav className="space-y-1">
              {proposal.sections.map((section, i) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(i)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg group ${
                    activeSection === i
                      ? "text-slate-900 bg-indigo-50"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 cursor-grab" />
                    <span>{section.title}</span>
                  </span>
                  {proposal.sections.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSection(i);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </button>
              ))}
            </nav>
            <button
              onClick={addSection}
              className="mt-4 w-full border border-dashed border-slate-300 rounded-lg py-2 text-xs font-bold text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Section
            </button>
          </div>

          {/* Quick client info */}
          <div className="p-4 space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Info</div>
            <input
              type="text"
              value={proposal.clientName}
              onChange={(e) => updateField("clientName", e.target.value)}
              placeholder="Client Name"
              className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <input
              type="text"
              value={proposal.clientCompany}
              onChange={(e) => updateField("clientCompany", e.target.value)}
              placeholder="Company"
              className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <input
              type="email"
              value={proposal.clientEmail}
              onChange={(e) => updateField("clientEmail", e.target.value)}
              placeholder="Email"
              className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total</label>
              <div className="flex gap-2">
                <select
                  value={proposal.currency}
                  onChange={(e) => updateField("currency", e.target.value)}
                  className="bg-slate-50 border-slate-200 rounded-lg px-2 py-2 text-sm w-20 focus:ring-indigo-500 outline-none"
                >
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                  <option value="GBP">£</option>
                </select>
                <input
                  type="number"
                  value={proposal.totalAmount}
                  onChange={(e) => updateField("totalAmount", e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Editor */}
        <main className="flex-1 bg-slate-100 overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-3xl space-y-6">
            {proposal.sections.map((section, i) => (
              <div
                key={section.id}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden relative group transition-all ${
                  activeSection === i
                    ? "border-indigo-300 ring-1 ring-indigo-200"
                    : "border-slate-200"
                }`}
                onClick={() => setActiveSection(i)}
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
                      {section.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateWithAI(i);
                      }}
                      disabled={generating === section.type}
                      className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 transition disabled:opacity-50"
                    >
                      {generating === section.type ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      {generating === section.type ? "Generating..." : "AI Assistant"}
                    </button>
                  </div>

                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(i, e.target.value)}
                    placeholder={`Write your ${section.title.toLowerCase()} content here...`}
                    rows={section.type === "cover" ? 8 : 6}
                    className="w-full bg-slate-50 border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:ring-indigo-500 focus:border-indigo-500 transition resize-y outline-none text-sm leading-relaxed"
                  />
                </div>

                {/* Drag handle */}
                <div className="absolute left-0 inset-y-0 w-1 bg-transparent group-hover:bg-indigo-200 cursor-move transition" />
              </div>
            ))}

            {/* Add section button */}
            <div className="flex justify-center py-4">
              <button
                onClick={addSection}
                className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition font-bold text-sm"
              >
                <Plus className="w-5 h-5" />
                Add Next Section
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}