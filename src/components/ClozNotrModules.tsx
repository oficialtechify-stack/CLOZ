import React, { useState } from 'react';
import { Megaphone, Wallet, StickyNote, Radio, Video, ShoppingBag, Crown, Music2 } from 'lucide-react';

type Module = 'Carteira' | 'Notas' | 'Meus anúncios' | 'Lives' | 'Vídeos' | 'Marketplace' | 'Premium' | 'Música';
const icons = { Carteira: Wallet, Notas: StickyNote, 'Meus anúncios': Megaphone, Lives: Radio, Vídeos: Video, Marketplace: ShoppingBag, Premium: Crown, Música: Music2 };
const descriptions: Record<Module,string> = {
  Carteira:'Área de saldo, movimentações e pagamentos. Nenhuma transação é realizada nesta versão.',
  Notas:'Anotações pessoais para organizar ideias e publicações.',
  'Meus anúncios':'Painel para campanhas patrocinadas do futuro CLOZ Ads. Não há cobrança ou publicação de anúncios.',
  Lives:'Descubra transmissões e acompanhe criadores. A transmissão ao vivo ainda requer infraestrutura.',
  Vídeos:'Espaço de vídeos curtos e longos. Upload e reprodução ainda serão integrados.',
  Marketplace:'Vitrine para descobrir produtos e vendedores. Compras ainda não estão habilitadas.',
  Premium:'Conheça os futuros benefícios Premium. Assinaturas ainda não estão disponíveis.',
  Música:'Seu espaço de músicas e playlists. Reprodução e licenças ainda serão integradas.'
};
export default function ClozNotrModules({module}:{module:Module}) {
 const [notes,setNotes]=useState<string[]>([]);
 const [draft,setDraft]=useState('');
 const [editing,setEditing]=useState<number|null>(null);
 const [filter,setFilter]=useState('');
 const [marketItems,setMarketItems]=useState<{title:string;price:string}[]>([]);
 const [itemTitle,setItemTitle]=useState('');
 const [itemPrice,setItemPrice]=useState('');
 const Icon=icons[module];
 return <section className="space-y-5" aria-label={module}>
  <div className="rounded-3xl border border-[#303030] bg-[#181818] p-6">
   <Icon size={30}/><h2 className="mt-4 text-2xl font-bold">{module}</h2>
   <p className="mt-3 text-sm leading-6 text-[#bcbcbc]">{descriptions[module]}</p>
  </div>
  {module==='Notas' && <div className="rounded-2xl bg-[#191919] p-5">
   <form onSubmit={e=>{e.preventDefault();const value=draft.trim();if(!value)return;setNotes(old=>editing===null?[value,...old]:old.map((n,i)=>i===editing?value:n));setDraft('');setEditing(null);}} className="space-y-3">
    <label className="block text-sm text-[#bbb]">Nova nota<textarea maxLength={1000} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Escreva sua ideia..." className="mt-2 min-h-28 w-full rounded-xl border border-[#444] bg-[#242424] p-3 text-white"/></label>
    <button disabled={!draft.trim()} className="rounded-full bg-white px-5 py-2 text-sm text-black disabled:opacity-50">{editing===null?'Adicionar nota':'Salvar alteração'}</button>
   </form>
   <input aria-label="Filtrar notas" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Buscar notas" className="mt-5 w-full rounded-xl border border-[#444] bg-[#242424] p-3 text-white"/><div className="mt-5 space-y-3">{notes.map((note,i)=>note.toLocaleLowerCase('pt-BR').includes(filter.toLocaleLowerCase('pt-BR'))?<article key={i} className="flex items-start justify-between gap-3 rounded-xl bg-[#292929] p-4"><p className="whitespace-pre-wrap break-words text-sm">{note}</p><button onClick={()=>{setEditing(i);setDraft(note);}} className="text-xs text-[#bbb]">Editar</button><button onClick={()=>{setNotes(old=>old.filter((_,index)=>index!==i));if(editing===i){setEditing(null);setDraft('');}}} className="text-xs text-[#bbb]">Excluir</button></article>:null)}</div>
   <p className="mt-4 text-xs text-[#999]">Notas temporárias desta sessão. Ainda não são salvas no servidor.</p>
  </div>}
  {module==='Marketplace' && <section className="space-y-4 rounded-2xl bg-[#191919] p-5"><h3 className="text-lg font-semibold">Meus itens</h3><p className="text-xs text-[#aaa]">Cadastro local para montar sua vitrine. Nenhum item é vendido ou enviado ao servidor.</p><form onSubmit={e=>{e.preventDefault();if(!itemTitle.trim()||!itemPrice.trim())return;setMarketItems(old=>[{title:itemTitle.trim(),price:itemPrice.trim()},...old]);setItemTitle('');setItemPrice('');}} className="grid gap-3 sm:grid-cols-[1fr_130px_auto]"><input required maxLength={100} value={itemTitle} onChange={e=>setItemTitle(e.target.value)} placeholder="Nome do item" className="min-w-0 rounded-xl border border-[#444] bg-[#252525] p-3 text-white"/><input required maxLength={20} value={itemPrice} onChange={e=>setItemPrice(e.target.value)} placeholder="Preço em R$" className="min-w-0 rounded-xl border border-[#444] bg-[#252525] p-3 text-white"/><button className="rounded-xl bg-white px-4 py-3 text-black">Adicionar</button></form><div className="grid gap-3 sm:grid-cols-2">{marketItems.map((item,i)=><article key={i} className="rounded-xl bg-[#292929] p-4"><h4 className="font-semibold">{item.title}</h4><p className="mt-2 text-sm text-[#bbb]">R$ {item.price}</p><button onClick={()=>setMarketItems(old=>old.filter((_,j)=>i!==j))} className="mt-4 text-xs text-[#aaa]">Remover item</button></article>)}</div></section>}
  {module==='Carteira' && <div className="rounded-2xl bg-[#191919] p-5"><p className="text-xs text-[#aaa]">Saldo disponível</p><p className="mt-2 text-3xl font-semibold">R$ 0,00</p><p className="mt-3 text-xs text-[#aaa]">Valor ilustrativo, não conectado a uma conta financeira.</p></div>}
  {module==='Meus anúncios' && <div className="rounded-2xl bg-[#191919] p-5"><h3 className="font-semibold">Campanhas</h3><p className="mt-2 text-sm text-[#aaa]">Nenhuma campanha. O CLOZ Ads será implementado futuramente.</p></div>}
  {module==='Premium' && <div className="rounded-2xl bg-[#191919] p-5"><h3 className="font-semibold">Benefícios planejados</h3><p className="mt-2 text-sm text-[#aaa]">Personalização avançada, recursos exclusivos e menos anúncios. Valores e condições ainda não definidos.</p></div>}
 </section>;
}
