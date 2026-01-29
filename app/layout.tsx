import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SEOWON SAFE-LINK | 실시간 안전통역',
  description: '서원토건 실시간 안전현장 통역 시스템 - 8개국어 지원',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SAFE-LINK',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
      </head>
      <body className="antialiased h-screen w-screen overflow-hidden selection:bg-sw-orange/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
