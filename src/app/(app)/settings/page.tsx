"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, ExternalLink } from "lucide-react";

interface SubscriptionInfo {
  tier: string;
  status: string | null;
  stripeCustomerId: string | null;
  subscription: {
    status: string;
    planTier: string;
    currentPeriodEnd: string | null;
  } | null;
}

export default function SettingsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [sub, setSub] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch("/api/stripe/subscription")
      .then((res) => res.json())
      .then((data) => setSub(data))
      .catch(() => setSub(null))
      .finally(() => setLoading(false));
  }, []);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Portal error:", err);
    } finally {
      setPortalLoading(false);
    }
  };

  const isActive = sub?.status === "active";
  const planLabel =
    sub?.tier === "pro" ? "Pro" : sub?.tier === "starter" ? "Starter" : "Free";

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-bold text-slate-900">Settings</h2>
      </header>
      <div className="flex-1 overflow-y-auto p-8 max-w-2xl">
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.firstName || ""}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-slate-50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user?.primaryEmailAddress?.emailAddress || ""}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 outline-none text-slate-500"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Subscription</h3>

            {loading ? (
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading subscription info...
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      Current Plan
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {planLabel}
                      {sub?.subscription?.currentPeriodEnd && (
                        <span>
                          {" "}
                          &bull; Renews{" "}
                          {new Date(
                            sub.subscription.currentPeriodEnd
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : sub?.status === "past_due" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-3 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" />
                        Past Due
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {planLabel}
                      </span>
                    )}
                  </div>
                </div>

                {sub?.stripeCustomerId ? (
                  <button
                    onClick={openPortal}
                    disabled={portalLoading}
                    className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition disabled:opacity-50"
                  >
                    {portalLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                    Manage Subscription →
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/#pricing")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
                  >
                    Upgrade to Pro →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}