
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Instagram, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { TradeVisionIcon } from "@/components/icons";

export default function GuestPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "G";
    const names = name.split(" ");
    if (names.length > 1) {
      return names[0][0] + names[1][0];
    }
    return names[0][0];
  };

  if (loading) {
    return <Loader2 className="h-12 w-12 animate-spin text-primary" />;
  }

  return (
    <div className="flex flex-col items-center space-y-6">
       <Card className="w-full max-w-lg text-center">
        <CardHeader>
           <div className="flex justify-center items-center gap-4 mb-4">
             <Avatar className="h-16 w-16">
                <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-headline">Welcome, {user?.displayName || "Explorer"}!</CardTitle>
                <CardDescription className="mt-1">Thank you for your interest in TradeVision.</CardDescription>
              </div>
           </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You are currently in a read-only guest mode. The features are disabled, but you are welcome to explore the interface.
            </p>
             <p className="font-medium text-foreground">
              To request full access to log and analyze your own trades, please contact me.
            </p>

            <Card className="bg-background/50">
                <CardContent className="pt-6 space-y-4">
                     <Button asChild variant="outline" className="w-full justify-start gap-4">
                        <Link href="mailto:mouaadidoufkir2@gmail.com" target="_blank">
                            <Mail className="h-5 w-5 text-primary" />
                            <span>mouaadidoufkir2@gmail.com</span>
                        </Link>
                     </Button>
                      <Button asChild variant="outline" className="w-full justify-start gap-4">
                        <Link href="https://wa.me/212721009527" target="_blank">
                            <Phone className="h-5 w-5 text-primary" />
                            <span>+212 721-009527 (WhatsApp)</span>
                        </Link>
                     </Button>
                      <Button asChild variant="outline" className="w-full justify-start gap-4">
                        <Link href="https://www.instagram.com/mouuuuaad_dev" target="_blank">
                            <Instagram className="h-5 w-5 text-primary" />
                            <span>@mouuuuaad_dev</span>
                        </Link>
                     </Button>
                </CardContent>
            </Card>

             <Button onClick={handleLogout} className="w-full">
                Logout
            </Button>
        </CardContent>
       </Card>
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <TradeVisionIcon className="h-5 w-5" />
            <span>Powered by TradeVision</span>
        </Link>
    </div>
  );
}
