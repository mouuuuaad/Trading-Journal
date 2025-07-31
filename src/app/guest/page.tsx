
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
import { Loader2, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { HsebliTradeIcon } from "@/components/icons";

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
);


export default function GuestPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
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
          <CardTitle className="text-2xl font-headline">مرحبًا، {user?.displayName || "المستكشف"}!</CardTitle>
          <CardDescription className="mt-1">شكرًا لاهتمامك بـ HsebliTrade.</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-muted-foreground">
        أنت حاليا في وضع الضيف للقراءة فقط. الميزات معطلة، ولكن مرحبًا بك لاستكشاف الواجهة.
      </p>
      <p className="font-medium text-foreground">
        لطلب الوصول الكامل لتسجيل وتحليل تداولاتك الخاصة، يرجى التواصل معي.
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
            <Link href="tel:+212721009527" target="_blank">
              <Phone className="h-5 w-5 text-primary" />
              <span>+212 721-009527 (لا يوجد واتساب)</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start gap-4">
            <Link href="https://t.me/MouuZ4" target="_blank">
              <TelegramIcon className="h-5 w-5 text-primary" />
              <span>@MouuZ4</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleLogout} className="w-full">
        تسجيل الخروج
      </Button>
    </CardContent>
  </Card>
  <Link  href="https://t.me/MouuZ4" target="_blank" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
    <HsebliTradeIcon className="h-5 w-5" />
    <span>تم الإنشاء بواسطة معاد إدافقير</span>
  </Link>
</div>

  );
}
