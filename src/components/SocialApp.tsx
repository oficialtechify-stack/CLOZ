import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, type User } from 'firebase/auth';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Heart, MessageCircle, Shirt, Users, Music2, ArrowLeft, LogOut } from 'lucide-react';

type Tab = 'looks' | 'stories' | 'closet' | 'music' | 'messages';
type Item = Record<string, unknown> & { id: string };
const sections: { id: Tab; label: string; icon: React.ElementType; collection: string }[] = [
  { id: 'looks', label: 'Looks', icon: Heart, collection: 'looks' },
  { id: 'stories', label: 'Stories', icon: Users, collection: 'stories' },
  { id: 'closet', label: 'Meu closet', icon: Shirt, collection: 'closetItems' },
  { id: 'music', label: 'Playlists', icon: Music2, collection: 'playlists' },
  { id: 'messages', label: 'Mensagens', icon: MessageCircle, collection: 'conversations' }
];
export default function SocialApp() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>('looks');
  const [items, setItems] = useState<Item[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'restricted' | 'error'>('loading');
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => {
    let active = true;
    setState('loading');
    const selected = sections.find(s => s.id === tab)!;
    // The Firestore production rules remain deny-all until ownership rules are installed.
    // Never fall back to fake records or expose private conversations from broad queries.
    if (tab === 'messages' || tab === 'closet') {
      setItems([]); setState('restricted'); return;
    }
    const q = query(collection(db, selected.collection), orderBy('createdAt', 'desc'), limit(12));
    getDocs(q).then(snapshot => { if (active) { setItems(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))); setState('ready'); } })
      .catch(() => { if (active) { setItems([]); setState('restricted'); } });
    return () => { active = false; };
  }, [tab]);
  return <div className="min-h-screen bg-[#f8f8f6] text-[#171717]">
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-black/10 bg-white/90 px-5 py-4 backdrop-blur">
      <div className="flex items-center gap-4"><a href="#/" className="flex items-center gap-1 text-xs text-gray-600"><ArrowLeft size={16}/> Voltar</a><strong className="text-2xl tracking-[-.08em]">CLOZ.</strong><span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] uppercase tracking-widest">Prévia</span></div>
      {user ? <button className="flex items-center gap-2 text-sm" onClick={() => signOut(auth)}><span>{user.displayName ?? user.email}</span><LogOut size={16}/></button> : <button className="rounded-full bg-black px-4 py-2 text-sm text-white" onClick={() => signInWithPopup(auth, new GoogleAuthProvider()).catch(() => alert('Não foi possível entrar. Verifique os domínios autorizados no Firebase.'))}>Entrar com Google</button>}
    </header>
    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 md:grid-cols-[210px_1fr]">
      <aside className="flex gap-2 overflow-auto md:flex-col">{sections.map(s => <button key={s.id} onClick={() => setTab(s.id)} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-left text-sm ${tab === s.id ? 'bg-black text-white' : 'bg-white hover:bg-neutral-100'}`}><s.icon size={17}/>{s.label}</button>)}</aside>
      <main><h1 className="mb-2 text-3xl font-semibold">{sections.find(s => s.id === tab)?.label}</h1><p className="mb-8 text-sm text-gray-500">Área social em integração com o Firebase CLOZ. Os dados do Base44 ainda não foram importados.</p>
        {state === 'loading' ? <p className="rounded-xl bg-white p-6">Carregando publicações…</p> :
         state === 'restricted' ? <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8"><h2 className="font-semibold">Área protegida durante a migração</h2><p className="mt-2 text-sm text-gray-600">Ainda estamos configurando as regras de segurança e a importação. Não há dados de demonstração nem acesso indevido a conteúdos privados.</p></div> :
         items.length === 0 ? <div className="rounded-2xl bg-white p-8 text-sm text-gray-500">Nenhum conteúdo importado ainda.</div> :
         <div className="grid gap-5 sm:grid-cols-2">{items.map(item => <article key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">{typeof item.imageUrl === 'string' && <img src={item.imageUrl} alt="Look da comunidade" className="aspect-square w-full object-cover" loading="lazy"/>}<div className="p-4"><strong>{typeof item.username === 'string' ? item.username : 'Comunidade CLOZ'}</strong><p className="mt-1 text-sm">{typeof item.caption === 'string' ? item.caption : ''}</p></div></article>)}</div>}
      </main>
    </div>
  </div>;
}
