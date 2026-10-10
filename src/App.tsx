import React, { useEffect, useState } from 'react';
import LandingPage from './components/LandingPage';
import SocialApp from './components/SocialApp';

export default function App() {
  const [isSocial, setIsSocial] = useState(window.location.hash.startsWith('#/app'));
  useEffect(() => {
    const onHashChange = () => setIsSocial(window.location.hash.startsWith('#/app'));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return <div className="min-h-screen bg-white text-[#171717] selection:bg-[#EAE8E1]">
    {isSocial ? <SocialApp /> : <>
      <LandingPage />
      <a href="#/app" className="fixed bottom-5 right-5 z-40 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-xl hover:bg-neutral-800">Explorar CLOZ →</a>
    </>}
  </div>;
}
