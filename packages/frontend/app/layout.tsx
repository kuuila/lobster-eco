import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Lobster Battle - Play to Earn',
  description: 'Lobster Battle Ecosystem - Game + Exchange + DAO',
  icons: {
    icon: '/lobster.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
