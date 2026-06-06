import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-white text-lg">P</div>
            <span className="text-2xl font-bold tracking-tight">Pitch<span className="text-indigo-400">Studio</span></span>
          </Link>
        </div>
        <div className="max-w-md">
          <blockquote className="text-2xl font-light leading-relaxed text-slate-300">
            &ldquo;PitchStudio cut my proposal time from 3 hours to 15 minutes. My close rate went up 40%.&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold text-white">AR</div>
            <div>
              <div className="font-semibold">Alex Rivera</div>
              <div className="text-sm text-slate-500">Freelance Designer</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          &copy; {new Date().getFullYear()} PitchStudio Inc.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">P</div>
              <span>Pitch<span className="text-indigo-500">Studio</span></span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-8">Sign in to continue creating winning proposals.</p>
          <SignIn
            appearance={{
              elements: {
                card: "shadow-none p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg py-2.5",
                dividerLine: "bg-slate-200",
                dividerText: "text-slate-400",
                formFieldLabel: "text-sm font-medium text-slate-700",
                formFieldInput: "rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 py-2.5",
                formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2.5 shadow-lg shadow-indigo-200",
                footerActionLink: "text-indigo-600 hover:text-indigo-700",
                identityPreviewText: "text-slate-600",
                identityPreviewEditButton: "text-indigo-600",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}