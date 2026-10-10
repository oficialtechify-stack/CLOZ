import React, { useEffect, useState } from 'react';
import LandingPage from './components/LandingPage';
import CommunityHub from './components/CommunityHub';

/** Reuses CLOZ's existing neutral palette, typography and landing experience.
 * Development-only route: no Firebase, production deployment or Base44 data.
 */
export default function App() {
  const [community, setCommunity] = useState(() => window.location.hash === '#/comunidade');
  useEffect(() => {
    const update = () => setCommunity(window.location.hash === '#/comunidade');
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return <div className="min-h-screen bg-white text-[#171717] selection:bg-[#EAE8E1]">
    {community ? <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#EAE8E1] bg-white/95 px-5 py-4 backdrop-blur">
        <a href="#/" aria-label="Voltar para início" className="text-2xl font-bold tracking-[-.08em]">CLOZ.</a>
        <span className="rounded-full bg-[#EAE8E1] px-3 py-1 text-xs text-[#171717]">Área em desenvolvimento</span>
      </header>
      <CommunityHub />
      <footer className="border-t border-[#EAE8E1] px-5 py-6 text-center text-xs text-neutral-500">CLOZ · Comunidade em construção · Dados demonstrativos</footer>
    </> : <>
      <LandingPage />
      <a href="#/comunidade" className="fixed bottom-5 right-5 z-40 rounded-full bg-[#171717] px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-black">Explorar comunidade →</a>
    </>}
  </div>;
}
