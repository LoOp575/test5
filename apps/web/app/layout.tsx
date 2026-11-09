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
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-40 bg-[#0B0F1A]/95 backdrop-blur-xl border-b border-white/10">
            <TopBar />
          </header>
          <div className="flex flex-1 min-h-0 max-w-[1600px] mx-auto w-full gap-3 px-2 lg:px-3 py-3">
            <Sidebar />
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
          <footer className="text-center py-2 text-white/30 text-[11px]">PVC Virtual Company v1.0 • Satu perusahaan • Free-only • Blueprint compliant • © 2025 PVC Founder • Visual gedung & sawah = data backend, bukan dekorasi</footer>
        </div>
      </body>
    </html>
  );
}
