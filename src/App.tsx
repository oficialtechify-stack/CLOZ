import React, { useEffect, useState } from 'react';
import { Bell, Camera, Compass, MessageCircle, Music2, Shirt, Sparkles, Users } from 'lucide-react';
import LandingPage from './components/LandingPage';
import CommunityHub from './components/CommunityHub';
import SocialFeatures from './components/SocialFeatures';
import { ClozEffects } from './components/ClozEffects';

type Feature = 'stories' | 'closet' | 'messages' | 'music' | 'sync' | 'notifications' | 'ai' | 'effects';
const navigation: {id: 'community' | Feature; label: string; icon: React.ElementType}[] = [
  {id:'community',label:'Feed, comunidades e perfil',icon:Compass},
  {id:'stories',label:'Stories',icon:Camera},
  {id:'closet',label:'Coleções e closet',icon:Shirt},
  {id:'messages',label:'Mensagens',icon:MessageCircle},
  {id:'music',label:'Música',icon:Music2},
  {id:'sync',label:'Ouvir juntos',icon:Users},
  {id:'notifications',label:'Notificações',icon:Bell},
  {id:'ai',label:'IA',icon:Sparkles},
  {id:'effects',label:'CLOZ Effects',icon:Sparkles}
];
function currentRoute() {
  const match = window.location.hash.match(/^#\/comunidade(?:\/([a-z]+))?$/);
  return match ? (navigation.find(t=>t.id===match[1])?.id ?? 'community') : null;
}
export default function App() {
  const [route,setRoute] = useState<ReturnType<typeof currentRoute>>(currentRoute);
  useEffect(()=>{
    const handle=()=>setRoute(currentRoute());
    window.addEventListener('hashchange',handle);
    return ()=>window.removeEventListener('hashchange',handle);
  },[]);
  return <div className="min-h-screen bg-[#FFFFFF] text-[#171717] selection:bg-[#EAE8E1]">
    {route ? <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#EAE8E1] bg-white/95 px-5 py-4 backdrop-blur">
        <a href="#/" className="text-2xl font-bold tracking-[-.08em]" aria-label="CLOZ — página inicial">CLOZ.</a>
        <span className="rounded-full bg-[#EAE8E1] px-3 py-1 text-xs">Protótipo offline</span>
      </header>
      <div className="mx-auto max-w-6xl px-4 pt-5">
        <nav aria-label="Áreas do CLOZ" className="flex gap-2 overflow-x-auto pb-3">
          {navigation.map(({id,label,icon:Icon})=><a key={id} href={id==='community'?'#/comunidade':`#/comunidade/${id}`} aria-current={route===id?'page':undefined} className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm ${route===id?'bg-[#171717] text-white':'bg-[#F2F0ED] hover:bg-[#EAE8E1]'}`}><Icon size={16}/>{label}</a>)}
        </nav>
      </div>
      {route==='community'?<CommunityHub/>:route==='effects'?<main className="mx-auto max-w-3xl px-4 py-8"><ClozEffects /></main>:<SocialFeatures tab={route}/>}
      <footer className="border-t border-[#EAE8E1] px-5 py-6 text-center text-xs text-neutral-500">CLOZ · Interface demonstrativa · Dados não salvos</footer>
    </> : <>
      <LandingPage />
      <a href="#/comunidade" className="fixed bottom-5 right-5 z-40 rounded-full bg-[#171717] px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-black">Explorar comunidade →</a>
    </>}
  </div>;
}
