import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PitchStudio — Proposals that convert",
  description:
    "Create polished, professional client proposals in minutes. AI-powered writing, gorgeous templates — close deals faster.",
  keywords: ["proposals", "freelance", "business proposals", "AI writing", "pitch deck"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(inter.className, "min-h-screen antialiased")}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}