import React, { useState } from 'react';
import { Bell, CircleUserRound, Clapperboard, Gem, Image, Palette, Settings2, ShieldCheck, Sparkles, Store, WandSparkles } from 'lucide-react';

export type ClozExtraSection = 'Reels'|'Stories'|'Loja de efeitos'|'Molduras'|'Banners'|'Selos'|'Nome animado'|'Notificações'|'Configurações';
export const extraSections: {label:ClozExtraSection;Icon:typeof Bell}[] = [
 {label:'Reels',Icon:Clapperboard},{label:'Stories',Icon:CircleUserRound},{label:'Loja de efeitos',Icon:Store},
 {label:'Molduras',Icon:Palette},{label:'Banners',Icon:Image},{label:'Selos',Icon:ShieldCheck},
 {label:'Nome animado',Icon:WandSparkles},{label:'Notificações',Icon:Bell},{label:'Configurações',Icon:Settings2}
];
const options: Record<'Molduras'|'Banners'|'Selos'|'Nome animado',string[]> = {
 Molduras:['Clássica','Neon','Estrelas','Aurora'],
 Banners:['Noite','Galáxia','Cidade','Minimalista'],
 Selos:['Criador','Comunidade','Artista','Gamer'],
 'Nome animado':['Normal','Brilho','Pulso','Gradiente']
};
export default function ClozExtraModules({section}:{section:ClozExtraSection}) {
 const [chosen,setChosen]=useState<Record<string,string>>({});
 const [notifications,setNotifications]=useState(true);
 const [privateProfile,setPrivateProfile]=useState(false);
 const [muted,setMuted]=useState(false);
 const [clips,setClips]=useState<{title:string;url:string}[]>([]);
 const [title,setTitle]=useState('');
 const [url,setUrl]=useState('');
 const selection=section==='Molduras'||section==='Banners'||section==='Selos'||section==='Nome animado';
 return <section className="space-y-5">
  <header className="rounded-3xl border border-[#333] bg-[#191919] p-6"><Sparkles size={28}/><h2 className="mt-3 text-2xl font-bold">{section}</h2><p className="mt-2 text-sm text-[#aaa]">{selection?'Experimente estilos no seu perfil. Escolhas temporárias, sem compras.':section==='Loja de efeitos'?'Catálogo de personalização. Compras e créditos ainda não estão habilitados.':section==='Configurações'?'Preferências locais para demonstração; ainda não vinculadas à conta.':section==='Notificações'?'Central de avisos; notificações reais serão integradas.':'Espaço de conteúdo em desenvolvimento. Você pode organizar links de demonstração abaixo.'}</p></header>
  {selection&&<div className="grid grid-cols-2 gap-3">{options[section].map(item=><button key={item} onClick={()=>setChosen(old=>({...old,[section]:item}))} aria-pressed={chosen[section]===item} className={`min-h-28 rounded-2xl border p-4 text-left ${chosen[section]===item?'border-white bg-[#333]':'border-[#333] bg-[#1b1b1b]'}`}><Gem className="mb-3"/><span className="font-semibold">{item}</span><p className="mt-2 text-xs text-[#aaa]">{chosen[section]===item?'Selecionado nesta sessão':'Visualizar estilo'}</p></button>)}</div>}
  {section==='Loja de efeitos'&&<div className="grid grid-cols-2 gap-3">{(['Molduras','Banners','Selos','Nome animado'] as const).map(item=><article key={item} className="rounded-2xl bg-[#1b1b1b] p-5"><Gem/><h3 className="mt-3 font-semibold">{item}</h3><p className="mt-2 text-xs text-[#aaa]">Disponível para prévia. Venda desativada.</p></article>)}</div>}
  {(section==='Reels'||section==='Stories')&&<div className="rounded-2xl bg-[#191919] p-5"><h3 className="font-semibold">Coleção de referências</h3><p className="mt-2 text-xs text-[#aaa]">Adicione links de vídeo ou imagem para organizar ideias. Isso não publica mídia na rede.</p><form onSubmit={e=>{e.preventDefault();if(!title.trim()||!url.trim())return;try{const u=new URL(url);if(!['http:','https:'].includes(u.protocol))return;}catch{return;}setClips(old=>[{title:title.trim(),url:url.trim()},...old]);setTitle('');setUrl('');}} className="mt-4 space-y-3"><input required maxLength={100} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" className="w-full rounded-xl border border-[#444] bg-[#252525] p-3"/><input required type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-[#444] bg-[#252525] p-3"/><button className="rounded-xl bg-white px-5 py-3 text-black">Adicionar referência</button></form><div className="mt-4 space-y-3">{clips.map((clip,i)=><article key={i} className="rounded-xl bg-[#292929] p-4"><p className="font-semibold">{clip.title}</p><a href={clip.url} target="_blank" rel="noopener noreferrer" className="mt-2 block break-all text-sm text-[#bbb] underline">Abrir referência</a><button onClick={()=>setClips(old=>old.filter((_,j)=>j!==i))} className="mt-3 text-xs text-[#aaa]">Remover</button></article>)}</div></div>}
  {section==='Notificações'&&<div className="rounded-2xl bg-[#191919] p-5"><Bell/><p className="mt-3 font-semibold">Nenhuma notificação por enquanto</p><p className="mt-2 text-sm text-[#aaa]">Curtidas, mensagens e novos seguidores aparecerão aqui após a integração.</p></div>}
  {section==='Configurações'&&<div className="space-y-3 rounded-2xl bg-[#191919] p-5">{([['Notificações',notifications,setNotifications],['Perfil privado',privateProfile,setPrivateProfile],['Silenciar sons',muted,setMuted]] as const).map(([label,value,update])=><label key={label} className="flex items-center justify-between gap-3 rounded-xl bg-[#292929] p-4"><span>{label}</span><input type="checkbox" checked={value} onChange={e=>update(e.target.checked)} className="h-5 w-5 accent-white"/></label>)}<p className="text-xs text-[#aaa]">Preferências apenas nesta sessão; não alteram privacidade ou notificações reais.</p></div>}
 </section>;
}
