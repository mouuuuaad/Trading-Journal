import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        {children}
      </div>
      <Toaster />
    </AuthProvider>
  );
}
