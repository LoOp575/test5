import './globals.css';
import type { Metadata } from 'next';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'PVC Virtual Company — Creative Future Together',
  description: 'Satu perusahaan virtual dengan kampus 2D tradisional Tiongkok di persawahan asri. 10 agent AI, 5 divisi.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased bg-[#0A0F1A]">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0F1A]/95 backdrop-blur-xl">
            <TopBar />
          </header>
          <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 gap-3 px-2 py-3 pb-20 sm:px-3 lg:gap-4 lg:px-4 lg:pb-3">
            <Sidebar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
          <footer className="hidden py-2 text-center text-[11px] text-white/30 lg:block">
            PVC Virtual Company v1.0 · Free-only · Blueprint compliant
          </footer>
        </div>
      </body>
    </html>
  );
}
