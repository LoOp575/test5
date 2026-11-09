'use client';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
export function MobileNav(){
  const [open,setOpen]=useState(false);
  return (
    <>
      <button onClick={()=>setOpen(!open)} className="lg:hidden fixed bottom-4 right-4 z-30 w-12 h-12 bg-zinc-900 text-white rounded-full shadow-xl flex items-center justify-center text-xl">{open?'✕':'☰'}</button>
      {open && <Sidebar mobileOpen={open} onClose={()=>setOpen(false)} />}
    </>
  );
}
