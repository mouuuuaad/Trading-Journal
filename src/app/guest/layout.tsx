
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest Access - TradeVision",
  description: "You are in guest mode. Please contact the administrator for full access.",
};

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
        {children}
      </div>
      <Toaster />
    </>
  );
}
