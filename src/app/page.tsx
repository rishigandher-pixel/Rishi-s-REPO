import Link from "next/link";
import { ArrowRight, Check, Sparkles, FileText, Zap, Shield } from "lucide-react";
import CheckoutButton from "@/components/CheckoutButton";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <svg width="32" height="32" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" className="h-8">
            <path d="M10 10 H30 C35 10 40 15 40 20 C40 25 35 30 30 30 H20 V40 H10 V10 Z" fill="#4F46E5"/>
            <path d="M20 20 H30 C32 20 33 21 33 22 C33 23 32 24 30 24 H20 V20 Z" fill="white"/>
            <path d="M40 20 L45 15 V25 L40 20 Z" fill="#818CF8"/>
            <text x="55" y="35" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="24" fill="#111827">Pitch</text>
            <text x="115" y="35" fontFamily="Inter, sans-serif" fontWeight="400" fontSize="24" fill="#4F46E5">Studio</text>
          </svg>
        </Link>
        <nav className="ml-auto flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="#templates" className="hover:text-primary transition-colors">
            Templates
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50" />
          <div className="relative mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8">
              <Sparkles className="h-4 w-4" />
              AI-Powered Proposal Builder
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Proposals that{" "}
              <span className="gradient-text">close deals</span>
              <br />
              in minutes, not hours.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Stop wasting time formatting documents. PitchStudio lets freelancers and
              small agencies create stunning, AI-powered proposals that win clients — fast.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#templates"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium hover:bg-secondary transition-colors"
              >
                View Templates
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> No credit card required
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> 14-day free trial
              </span>
            </div>
          </div>
        </section>

        {/* Waitlist CTA */}
        <section className="border-t border-border/40 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 px-4 py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Get early access
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              We&apos;re launching soon. Join the waitlist to be the first to try PitchStudio and get an exclusive launch discount.
            </p>
            <WaitlistForm />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t border-border/40 px-4 py-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to win more clients
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From AI drafting to polished delivery — we&apos;ve got you covered.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="group relative rounded-xl border border-border/50 bg-card p-8 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Preview */}
        <section id="templates" className="border-t border-border/40 bg-secondary/30 px-4 py-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Beautiful templates, built for conversion
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose from professionally designed templates that impress clients before you even meet them.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {["Modern", "Professional", "Creative"].map((template) => (
                <div
                  key={template}
                  className="group relative overflow-hidden rounded-xl border border-border/50 bg-card"
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-indigo-50 to-white p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-3/4 rounded bg-indigo-200/50" />
                      <div className="h-3 w-1/2 rounded bg-gray-200" />
                      <div className="mt-4 space-y-2">
                        <div className="h-2 w-full rounded bg-gray-100" />
                        <div className="h-2 w-5/6 rounded bg-gray-100" />
                        <div className="h-2 w-4/6 rounded bg-gray-100" />
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="h-2 w-full rounded bg-gray-100" />
                        <div className="h-2 w-3/4 rounded bg-gray-100" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border/50">
                    <h4 className="font-semibold">{template}</h4>
                    <p className="text-sm text-muted-foreground">
                      {template === "Modern"
                        ? "Clean, minimalist design"
                        : template === "Professional"
                          ? "Formal, structured layout"
                          : "Bold, colorful presentation"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="border-t border-border/40 px-4 py-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple pricing, no surprises
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Start free, upgrade when you need more power.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-xl border p-8 ${
                    plan.popular
                      ? "border-primary shadow-xl shadow-primary/10 bg-card"
                      : "border-border/50 bg-card"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold">${plan.price}</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <CheckoutButton
                      planTier={plan.name === "Starter" ? "starter" : "pro"}
                      className={`mt-8 flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium transition-all ${
                        plan.popular
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
                          : "border border-border bg-background hover:bg-secondary"
                      }`}
                    >
                      {plan.cta}
                    </CheckoutButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 px-4 py-8">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-bold">
            <svg width="28" height="28" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" className="h-6">
              <path d="M10 10 H30 C35 10 40 15 40 20 C40 25 35 30 30 30 H20 V40 H10 V10 Z" fill="#4F46E5"/>
              <path d="M20 20 H30 C32 20 33 21 33 22 C33 23 32 24 30 24 H20 V20 Z" fill="white"/>
            </svg>
            PitchStudio
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PitchStudio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "AI-Powered Writing",
    description:
      "Generate compelling proposal content from a few bullet points. Our AI understands your services and crafts persuasive copy that wins.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Gorgeous Templates",
    description:
      "Professional templates designed by experts. Modern, Professional, and Creative — each optimized for readability and conversion.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description:
      "From blank page to polished proposal in under 5 minutes. Stop wrestling with formatting and focus on closing the deal.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Client-Ready PDFs",
    description:
      "Export as polished PDFs or share a secure link. Track when clients view your proposal and follow up at the perfect moment.",
  },
  {
    icon: <ArrowRight className="h-6 w-6" />,
    title: "CRM Integrations",
    description:
      "Connect with your favorite tools — HubSpot, Notion, and more. Your proposals stay in your workflow. (Coming soon)",
  },
  {
    icon: <Check className="h-6 w-6" />,
    title: "Custom Branding",
    description:
      "Your brand, your colors, your logo. Every proposal reinforces your identity and builds trust with potential clients.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for freelancers just getting started.",
    price: 19,
    features: [
      "5 proposals per month",
      "Basic templates (Modern, Professional)",
      "AI writing assistant",
      "PDF export",
      "Email support",
    ],
    cta: "Start Free Trial",
    ctaHref: "/sign-up",
    popular: false,
  },
  {
    name: "Pro",
    description: "For growing agencies and power users.",
    price: 39,
    features: [
      "Unlimited proposals",
      "All templates (Modern, Pro, Creative)",
      "Advanced AI writing with custom tone",
      "Advanced analytics & tracking",
      "CRM integrations",
      "Custom branding (colors, logo, domain)",
      "Priority support",
    ],
    cta: "Start Free Trial",
    ctaHref: "/sign-up",
    popular: true,
  },
];/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
