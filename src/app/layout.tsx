import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';

export const metadata: Metadata = {
  title: 'Wasil | واصل — منصة الهوية الرقمية الذكية ونمو العملاء والولاء',
  description: 'منصة متكاملة لبطاقات الأعمال الرقمية، حفظ البطاقات في Apple Wallet و Google Wallet، جذب العملاء، برامج الولاء وإدارة المبيعات في سلطنة عُمان.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-wasil-bg text-wasil-text antialiased selection:bg-wasil-violet selection:text-white">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
