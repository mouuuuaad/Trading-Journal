
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HsebliTradeIcon } from '@/components/icons';
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: "Login - HsebliTrade",
//   description: "Access your personal trading journal.",
// };

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginSchema = z.infer<typeof loginSchema>;


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // AuthProvider will handle the redirect
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // AuthProvider will handle the redirect
    } catch (error: any) {
      toast({
        title: "Google Sign-In Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
        setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
  <Card className="mx-auto w-full max-w-sm">
    <CardHeader className="text-center space-y-2">
      <HsebliTradeIcon className="mx-auto h-12 w-auto" />
      <CardTitle className="font-headline text-3xl">HsebliTrade</CardTitle>
      <CardDescription>أدخل بيانات الدخول للوصول إلى دفتر تداولاتك</CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@domain.com"
            {...register("email")}
            disabled={isSubmitting || isGoogleLoading}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            disabled={isSubmitting || isGoogleLoading}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isGoogleLoading}
        >
          {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>
      </form>

      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">أو تابع باستخدام</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full mt-4"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting || isGoogleLoading}
      >
        {isGoogleLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول باستخدام Google"}
      </Button>

      <div className="mt-4 text-center text-sm">
        لا تملك حساباً؟{' '}
        <Link href="/signup" className="underline">
          أنشئ حساباً
        </Link>
      </div>
    </CardContent>
  </Card>

  <Link
     href="https://t.me/MouuZ4" target="_blank"
    className="mt-6 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
  >
    <HsebliTradeIcon className="h-5 w-5" />
    <span>تم الإنشاء بواسطة Mouaad Idoufkir</span>
  </Link>
</div>

  );
}
