import { Toaster } from "@/components/ui/toaster";

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
