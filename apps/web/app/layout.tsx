import './globals.css';
import type { Metadata } from 'next';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'PVC Virtual Company',
  description: 'Workspace perusahaan virtual untuk mengelola agent AI, proyek, tugas, dan kampus 2D.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0F1A]/95 backdrop-blur-xl">
            <TopBar />
          </header>
          <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 gap-3 px-3 py-4 pb-24 sm:px-4 lg:gap-5 lg:px-5 lg:pb-5">
            <Sidebar />
            <main className="pvc-page min-w-0 flex-1">{children}</main>
          </div>
          <footer className="hidden py-3 text-center text-[11px] text-slate-400 lg:block">
            PVC Virtual Company · Workspace
          </footer>
        </div>
      </body>
    </html>
  );
}
