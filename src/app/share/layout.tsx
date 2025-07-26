
import { ThemeProvider } from "@/components/theme-provider";
import { TradeVisionIcon } from "@/components/icons";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        {children}
        <footer className="mt-auto flex items-center justify-center p-4">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
                <TradeVisionIcon className="h-5 w-5" />
                <span>Powered by TradeVision</span>
            </Link>
        </footer>
      </div>
      <Toaster />
    </>
  );
}
