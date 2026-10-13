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
 const Icon=icons[module];
 return <section className="space-y-5" aria-label={module}>
  <div className="rounded-3xl border border-[#303030] bg-[#181818] p-6">
   <Icon size={30}/><h2 className="mt-4 text-2xl font-bold">{module}</h2>
   <p className="mt-3 text-sm leading-6 text-[#bcbcbc]">{descriptions[module]}</p>
  </div>
  {module==='Notas' && <div className="rounded-2xl bg-[#191919] p-5">
   <form onSubmit={e=>{e.preventDefault();const value=draft.trim();if(!value)return;setNotes(old=>[value,...old]);setDraft('');}} className="space-y-3">
    <label className="block text-sm text-[#bbb]">Nova nota<textarea maxLength={1000} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Escreva sua ideia..." className="mt-2 min-h-28 w-full rounded-xl border border-[#444] bg-[#242424] p-3 text-white"/></label>
    <button disabled={!draft.trim()} className="rounded-full bg-white px-5 py-2 text-sm text-black disabled:opacity-50">Adicionar nota</button>
   </form>
   <div className="mt-5 space-y-3">{notes.map((note,i)=><article key={i} className="flex items-start justify-between gap-3 rounded-xl bg-[#292929] p-4"><p className="whitespace-pre-wrap break-words text-sm">{note}</p><button onClick={()=>setNotes(old=>old.filter((_,index)=>index!==i))} className="text-xs text-[#bbb]">Excluir</button></article>)}</div>
   <p className="mt-4 text-xs text-[#999]">Notas temporárias desta sessão. Ainda não são salvas no servidor.</p>
  </div>}
  {module==='Carteira' && <div className="rounded-2xl bg-[#191919] p-5"><p className="text-xs text-[#aaa]">Saldo disponível</p><p className="mt-2 text-3xl font-semibold">R$ 0,00</p><p className="mt-3 text-xs text-[#aaa]">Valor ilustrativo, não conectado a uma conta financeira.</p></div>}
  {module==='Meus anúncios' && <div className="rounded-2xl bg-[#191919] p-5"><h3 className="font-semibold">Campanhas</h3><p className="mt-2 text-sm text-[#aaa]">Nenhuma campanha. O CLOZ Ads será implementado futuramente.</p></div>}
  {module==='Premium' && <div className="rounded-2xl bg-[#191919] p-5"><h3 className="font-semibold">Benefícios planejados</h3><p className="mt-2 text-sm text-[#aaa]">Personalização avançada, recursos exclusivos e menos anúncios. Valores e condições ainda não definidos.</p></div>}
 </section>;
}
