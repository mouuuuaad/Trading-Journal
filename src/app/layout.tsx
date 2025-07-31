import type {Metadata} from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';

export const metadata: Metadata = {
  title: 'HsebliTrade - Your Personal Trading Journal',
  description: 'Log, manage, and analyze your trades with an interactive and modern dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html dir='RTL' lang="ar" suppressHydrationWarning>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet" />
  </head>
  <body className="font-body antialiased">
    <AuthProvider>
      {children}
    </AuthProvider>
  </body>
</html>

  );
}
