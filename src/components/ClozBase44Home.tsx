import React, { useState } from 'react';
import { Compass, Search, Plus, Users, UserRound, Music2, Heart, MessageCircle, Sparkles, ShoppingBag, Video, Radio, Crown } from 'lucide-react';
import { ClozEffects } from './ClozEffects';
import CommunityHub from './CommunityHub';
import SocialFeatures from './SocialFeatures';

/** Base44-inspired CLOZ homepage. Visual-only, no external writes or deployment. */
export default function ClozBase44Home() {
  const [tab,setTab]=useState<'Recente'|'Seguindo'|'Se descobrindo'>('Recente');
  const [section,setSection]=useState('Início');
  const [profileName,setProfileName]=useState('Meu perfil');
  const [bio,setBio]=useState('Criando e compartilhando no CLOZ.');
  const [liked,setLiked]=useState<string[]>([]);
  const stories=['Seu story','dev.lia','rafa.street','pixel.ana','cloz'];
  const posts=[
    {id:'1',author:'dev.lia',category:'Programação',text:'Construindo ideias, compartilhando projetos e encontrando minha comunidade.',gradient:'from-[#3c3c50] to-[#11111b]'},
    {id:'2',author:'rafa.street',category:'Moda',text:'Criatividade em cada detalhe. Qual é a sua inspiração hoje?',gradient:'from-[#443b37] to-[#17120f]'},
    {id:'3',author:'pixel.ana',category:'Games',text:'Um universo inteiro pode começar com um pixel.',gradient:'from-[#293b45] to-[#0e1419]'},
    {id:'4',author:'cloz',category:'Comunidade',text:'Seu espaço para criar, descobrir e se conectar.',gradient:'from-[#463448] to-[#140f16]'}
  ];
  return <main className="min-h-screen bg-black px-4 pb-32 pt-6 text-white" style={{colorScheme:'dark'}}>
    <div className="mx-auto max-w-[860px]">
      <header className="mb-8 flex items-center justify-between"><h1 className="text-3xl font-black tracking-[-0.08em]">CLOZ</h1><button aria-label="Buscar" className="rounded-full bg-[#202020] p-3"><Search size={20}/></button></header>
      <nav aria-label="Categorias do feed" className="mb-6 flex gap-7 overflow-x-auto border-b border-[#262626]">{(['Recente','Seguindo','Se descobrindo'] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={`whitespace-nowrap pb-4 text-sm ${tab===t?'border-b-2 border-white font-semibold':'text-[#999]'}`}>{t}</button>)}</nav>
      <div aria-label="Stories" className="mb-8 flex gap-4 overflow-x-auto pb-2">{stories.map((name,i)=><button key={name} className="flex min-w-[70px] flex-col items-center gap-2 text-xs"><span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#eaeaea] bg-[#242424] text-xl font-semibold">{i===0?<Plus/>:name[0].toUpperCase()}</span><span className="max-w-[72px] truncate">{name}</span></button>)}</div>
      {section==='Início'?<div className="grid grid-cols-2 gap-3 sm:gap-4">{(tab==='Seguindo'?[]:posts).map(post=><article key={post.id} className="overflow-hidden rounded-2xl bg-[#171717]"><div className={`flex aspect-[4/5] items-center justify-center bg-gradient-to-br p-5 ${post.gradient}`}><span className="text-center text-xl font-semibold tracking-tight sm:text-3xl">{post.category}</span></div><div className="p-3"><p className="mb-2 text-xs font-semibold">@{post.author}</p><p className="line-clamp-2 text-xs text-[#c5c5c5]">{post.text}</p><div className="mt-3 flex gap-3"><button aria-label="Curtir" onClick={()=>setLiked(v=>v.includes(post.id)?v.filter(x=>x!==post.id):[...v,post.id])}><Heart size={17} fill={liked.includes(post.id)?'white':'none'}/></button><button aria-label="Comentários"><MessageCircle size={17}/></button></div></div></article>)}{tab==='Seguindo'&&<p className="col-span-2 py-16 text-center text-[#aaa]">As publicações de quem você segue aparecerão aqui.</p>}</div>:null}
      {section==='Criar publicação' && <section className="rounded-2xl bg-[#181818] p-4"><h2 className="mb-4 text-xl font-semibold">Criar publicação</h2><p className="mb-4 text-sm text-[#aaa]">Editor demonstrativo da comunidade. Publicações ainda não são salvas no Firebase.</p><div className="rounded-xl bg-white text-black"><CommunityHub/></div></section>}
      {section==='Mensagens' && <div className="rounded-xl bg-white text-black"><SocialFeatures tab="messages"/></div>}
      {section==='Perfil' && <section className="space-y-5"><div className="overflow-hidden rounded-2xl bg-[#191919]"><div className="h-36 bg-gradient-to-r from-[#2d2540] to-[#141414]"/><div className="p-5"><div className="-mt-12 mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#191919] bg-[#383047] text-3xl">✦</div><label className="block text-xs text-[#aaa]">Nome<input maxLength={80} value={profileName} onChange={e=>setProfileName(e.target.value)} className="mt-2 w-full rounded-xl border border-[#444] bg-[#252525] p-3 text-white"/></label><label className="mt-4 block text-xs text-[#aaa]">Biografia<textarea maxLength={500} value={bio} onChange={e=>setBio(e.target.value)} className="mt-2 w-full rounded-xl border border-[#444] bg-[#252525] p-3 text-white"/></label><p className="mt-3 text-xs text-[#999]">Personalização local de demonstração, ainda não salva no Firebase.</p></div></div><ClozEffects displayName={profileName}/></section>}
      {section==='Comunidades' && <section className="grid gap-4 sm:grid-cols-2">{['Programação','Moda','Games','Arte','Música','Tecnologia'].map(name=><article key={name} className="rounded-2xl border border-[#333] bg-[#181818] p-6"><Users className="mb-4"/><h2 className="font-semibold">{name}</h2><p className="mt-2 text-xs text-[#aaa]">Comunidade em preparação.</p></article>)}</section>}
      {section==='Descobrir' && <section className="space-y-4"><h2 className="text-xl font-semibold">Descobrir no CLOZ</h2><div className="grid grid-cols-2 gap-3">{([['Vídeos',Video],['Lives',Radio],['Marketplace',ShoppingBag],['Premium',Crown],['Mensagens',MessageCircle],['CLOZ Effects',Sparkles]] as const).map(([label,Icon])=><button key={label} onClick={()=>setSection(label)} className="flex min-h-32 flex-col justify-center gap-3 rounded-2xl bg-[#1b1b1b] p-5 text-left"><Icon/><span>{label}</span></button>)}</div></section>}
      {['Vídeos','Lives','Marketplace','Premium','CLOZ Effects'].includes(section) && <section className="space-y-5"><button onClick={()=>setSection('Descobrir')} className="text-sm text-[#aaa]">← Descobrir</button><h2 className="text-2xl font-semibold">{section}</h2>{section==='CLOZ Effects'?<ClozEffects/>:<p className="rounded-2xl bg-[#191919] p-6 text-[#aaa]">Área em desenvolvimento. Ainda não há transmissões, compras ou assinaturas reais.</p>}</section>}
    </div>
    <nav aria-label="Navegação principal" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-5 rounded-full border border-[#888] bg-[#dedede] px-5 py-3 text-black shadow-2xl sm:gap-8"><button aria-label="Início" onClick={()=>setSection('Início')}><Compass/></button><button aria-label="Comunidades" onClick={()=>setSection('Comunidades')}><Users/></button><button aria-label="Criar publicação" onClick={()=>setSection('Criar publicação')} className="rounded-full bg-black p-3 text-white"><Plus/></button><button aria-label="Descobrir" onClick={()=>setSection('Descobrir')}><Search/></button><button aria-label="Perfil" onClick={()=>setSection('Perfil')}><UserRound/></button></nav>
    <button aria-label="Música" title="Recurso em desenvolvimento" className="fixed bottom-28 right-4 rounded-full border border-[#444] bg-[#222] p-3"><Music2/></button>
  </main>;
}
