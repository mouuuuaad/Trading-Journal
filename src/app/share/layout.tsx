
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Profile - TradeVision",
  description: "View a shared, read-only trading journal.",
};

export default function ShareLayout({
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
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            {children}
        </div>
        <Toaster />
    </ThemeProvider>
  );
}
