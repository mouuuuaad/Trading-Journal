
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/dashboard/header";
import Link from "next/link";
import { HsebliTradeIcon } from "@/components/icons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - HsebliTrade",
  description: "Your personal trading dashboard. Analyze your performance at a glance.",
};


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <Header/>
          {children}
          <footer className="mt-auto flex items-center justify-center p-4 no-print">
             <Link href="https://www.instagram.com/mouuuuaad_dev" target="_blank" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
                <HsebliTradeIcon className="h-5 w-5" />
                <span>Created by Mouaad Idoufkir</span>
            </Link>
          </footer>
        </div>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
