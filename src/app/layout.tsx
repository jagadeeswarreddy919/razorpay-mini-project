import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ResolveX — Track. Investigate. Resolve.',
  description:
    'ResolveX helps customers track failed and pending payments, verify bank debits, raise resolution cases, communicate with support, and follow the issue until final resolution. Built for Razorpay Buildathon 2026.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen font-sans selection:bg-purple-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
