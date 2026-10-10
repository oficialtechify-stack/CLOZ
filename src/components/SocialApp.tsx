import React, { useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Shirt, Music2, Users, Bell, Bookmark, Send, Plus, Search, Sparkles } from 'lucide-react';

type Page = 'feed' | 'profile' | 'stories' | 'closet' | 'music' | 'messages' | 'notifications' | 'ai';
const pages: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'feed', label: 'Lookbook', icon: Heart }, { id: 'profile', label: 'Meu perfil', icon: Users },
  { id: 'stories', label: 'Stories', icon: Plus }, { id: 'closet', label: 'Closet', icon: Shirt },
  { id: 'music', label: 'Música', icon: Music2 }, { id: 'messages', label: 'Mensagens', icon: MessageCircle },
  { id: 'notifications', label: 'Notificações', icon: Bell }, { id: 'ai', label: 'Studio IA', icon: Sparkles }
];
type Post = { id: number; author: string; text: string; category: string; likes: number; liked: boolean; saved: boolean; comments: string[] };
const initialPosts: Post[] = [
  { id: 1, author: 'cloz.community', text: 'Camadas, texturas e uma identidade só sua. Qual detalhe faz o look?', category: 'Streetwear', likes: 24, liked: false, saved: false, comments: ['Amei a proposta!'] },
  { id: 2, author: 'studio.style', text: 'Menos regras, mais expressão. Explorando um visual minimalista.', category: 'Minimalista', likes: 18, liked: false, saved: false, comments: [] }
];
export default function SocialApp() {
  const [page, setPage] = useState<Page>('feed');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [draft, setDraft] = useState('');
  const [comments, setComments] = useState<Record<number, string>>({});
  const [following, setFollowing] = useState(false);
  const [query, setQuery] = useState('');
  const [storyIndex, setStoryIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState(['Oi! Bora montar um look?']);
  const [chatDraft, setChatDraft] = useState('');
  const [closetItems, setClosetItems] = useState(['Jaqueta vintage', 'Calça wide leg', 'Tênis branco']);
  const [closetDraft, setClosetDraft] = useState('');
  const updatePost = (id: number, fn: (p: Post) => Post) => setPosts(all => all.map(p => p.id === id ? fn(p) : p));
  const addPost = () => { if (!draft.trim()) return; setPosts(all => [{ id: Date.now(), author: 'meu.perfil', text: draft.trim(), category: 'Meu estilo', likes: 0, liked: false, saved: false, comments: [] }, ...all]); setDraft(''); };
  const visiblePosts = posts.filter(p => (p.author + p.text + p.category).toLowerCase().includes(query.toLowerCase()));
  return <div className="min-h-screen bg-[#f7f6f3] text-[#171717]">
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-black/10 bg-white/95 px-5 py-4 backdrop-blur">
      <div className="flex items-center gap-4"><a href="#/" className="flex items-center gap-1 text-xs text-gray-600"><ArrowLeft size={16}/> Voltar</a><strong className="text-2xl tracking-[-.08em]">CLOZ.</strong><span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] uppercase tracking-widest">Protótipo local</span></div>
      <div className="text-xs text-neutral-500">Sem banco de dados conectado</div>
    </header>
    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 md:grid-cols-[220px_1fr]">
      <nav aria-label="Navegação do Cloz" className="flex gap-2 overflow-x-auto md:flex-col">{pages.map(p => <button key={p.id} onClick={() => setPage(p.id)} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-left text-sm ${page === p.id ? 'bg-black text-white' : 'bg-white hover:bg-neutral-100'}`}><p.icon size={17}/>{p.label}</button>)}</nav>
      <main className="min-w-0">
        <h1 className="mb-2 text-3xl font-semibold">{pages.find(p => p.id === page)?.label}</h1>
        <p className="mb-6 text-sm text-neutral-500">Demonstração interativa: alterações não são salvas e não usam dados reais do Base44.</p>
        {page === 'feed' && <div className="max-w-2xl space-y-5">
          <div className="rounded-2xl bg-white p-5"><label htmlFor="post" className="mb-2 block text-sm font-semibold">Compartilhe seu estilo</label><textarea id="post" className="w-full rounded-xl border border-neutral-200 p-3 text-sm" rows={3} value={draft} onChange={e => setDraft(e.target.value)} placeholder="Qual é a inspiração de hoje?"/><button onClick={addPost} disabled={!draft.trim()} className="mt-3 rounded-full bg-black px-5 py-2 text-sm text-white disabled:opacity-40">Publicar demonstração</button></div>
          <label className="flex items-center gap-2 rounded-xl bg-white p-3"><Search size={17}/><input className="w-full outline-none" placeholder="Buscar looks e estilos" value={query} onChange={e => setQuery(e.target.value)}/></label>
          {visiblePosts.map(post => <article key={post.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="flex items-center justify-between p-4"><strong>@{post.author}</strong><span className="rounded-full bg-neutral-100 px-3 py-1 text-xs">{post.category}</span></div>
            <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-[#e5ded3] via-[#c6bdb0] to-[#90877d]"><div className="text-center"><Shirt className="mx-auto mb-2 opacity-60" size={58}/><p className="text-sm tracking-widest">VISUAL DE DEMONSTRAÇÃO</p></div></div>
            <div className="p-4"><p className="mb-4 text-sm">{post.text}</p><div className="flex gap-4">
              <button aria-label="Curtir" onClick={() => updatePost(post.id, p => ({...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1)}))} className="flex items-center gap-1 text-sm"><Heart size={18} fill={post.liked ? 'currentColor' : 'none'}/>{post.likes}</button>
              <span className="flex items-center gap-1 text-sm"><MessageCircle size={18}/>{post.comments.length}</span>
              <button aria-label="Salvar" onClick={() => updatePost(post.id, p => ({...p, saved: !p.saved}))}><Bookmark size={18} fill={post.saved ? 'currentColor' : 'none'}/></button>
            </div>{post.comments.map((c,i)=><p key={i} className="mt-3 rounded-lg bg-neutral-50 p-2 text-sm">{c}</p>)}
            <div className="mt-3 flex gap-2"><input aria-label="Novo comentário" className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm" placeholder="Comentar..." value={comments[post.id] ?? ''} onChange={e=>setComments(prev=>({...prev,[post.id]:e.target.value}))}/><button aria-label="Enviar comentário" onClick={()=>{const c=comments[post.id]?.trim();if(c) updatePost(post.id,p=>({...p,comments:[...p.comments,c]}));setComments(prev=>({...prev,[post.id]:''}));}}><Send size={18}/></button></div>
            </div>
          </article>)}
        </div>}
        {page === 'profile' && <div className="max-w-2xl rounded-2xl bg-white p-6"><div className="mb-5 h-28 rounded-xl bg-[#d1c8ba]"/><div className="flex items-end justify-between"><div><div className="-mt-12 mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-neutral-800 text-3xl text-white">C</div><h2 className="text-xl font-semibold">@meu.perfil</h2><p className="text-sm text-neutral-500">Moda, criatividade e expressão pessoal.</p></div><button onClick={()=>setFollowing(!following)} className="rounded-full border border-black px-4 py-2 text-sm">{following?'Seguindo':'Seguir (teste)'}</button></div><div className="mt-6 flex gap-6 text-sm"><span>{posts.filter(p=>p.author==='meu.perfil').length} publicações</span><span>{following ? 1 : 0} seguidores (demo)</span></div></div>}
        {page === 'stories' && <div className="max-w-md rounded-2xl bg-white p-5"><div className="flex gap-2 pb-3">{['Meu dia','Inspirações','Street style'].map((s,i)=><button key={s} onClick={()=>setStoryIndex(i)} className={`rounded-full px-3 py-2 text-xs ${storyIndex===i?'bg-black text-white':'bg-neutral-100'}`}>{s}</button>)}</div><div className="flex aspect-[9/13] items-center justify-center rounded-2xl bg-gradient-to-b from-stone-400 to-stone-800 text-center text-white"><div><p className="text-sm uppercase tracking-widest">Story demonstrativo</p><h2 className="mt-2 text-2xl">{['Meu dia','Inspirações','Street style'][storyIndex]}</h2></div></div><button className="mt-4 rounded-full bg-black px-5 py-2 text-sm text-white" onClick={()=>setStoryIndex((storyIndex+1)%3)}>Próximo story →</button></div>}
        {page === 'closet' && <div className="max-w-2xl rounded-2xl bg-white p-5"><div className="flex gap-2"><input className="min-w-0 flex-1 rounded-xl border border-neutral-200 p-3" value={closetDraft} onChange={e=>setClosetDraft(e.target.value)} placeholder="Nome de uma peça"/><button className="rounded-xl bg-black px-4 text-white" onClick={()=>{if(closetDraft.trim())setClosetItems(a=>[...a,closetDraft.trim()]);setClosetDraft('')}}>Adicionar</button></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{closetItems.map((item,i)=><div key={i} className="rounded-xl border border-neutral-100 p-4"><Shirt size={24}/><p className="mt-2 text-sm">{item}</p><button onClick={()=>setClosetItems(a=>a.filter((_,j)=>j!==i))} className="mt-2 text-xs text-neutral-500">Remover</button></div>)}</div></div>}
        {page === 'music' && <div className="max-w-2xl rounded-2xl bg-white p-6"><h2 className="font-semibold">Playlists do Cloz</h2><p className="mt-2 text-sm text-neutral-500">Suas playlists e sincronização entre amigos serão conectadas depois. Nenhuma música é transmitida nesta prévia.</p>{['Meu mood','Lookbook radio','Favoritas'].map(s=><div key={s} className="mt-3 rounded-lg bg-neutral-100 p-3">{s}</div>)}</div>}
        {page === 'messages' && <div className="max-w-2xl rounded-2xl bg-white p-5"><h2 className="mb-3 font-semibold">Conversa demonstrativa</h2><div className="space-y-3">{chatMessages.map((m,i)=><p key={i} className={`w-fit max-w-[85%] rounded-xl px-4 py-3 text-sm ${i?'ml-auto bg-black text-white':'bg-neutral-100'}`}>{m}</p>)}</div><div className="mt-6 flex gap-2"><input className="min-w-0 flex-1 rounded-xl border border-neutral-200 p-3 text-sm" value={chatDraft} onChange={e=>setChatDraft(e.target.value)} placeholder="Escreva uma mensagem de teste"/><button onClick={()=>{if(chatDraft.trim())setChatMessages(a=>[...a,chatDraft.trim()]);setChatDraft('')}}><Send size={20}/></button></div></div>}
        {page === 'notifications' && <div className="max-w-2xl rounded-2xl bg-white p-6 text-sm text-neutral-500">Curtidas, seguidores e mensagens aparecerão aqui após a integração. Nenhuma notificação real nesta prévia.</div>}
        {page === 'ai' && <div className="max-w-2xl rounded-2xl bg-white p-6"><Sparkles size={30}/><h2 className="mt-4 text-xl font-semibold">CLOZ Style Studio</h2><p className="mt-2 text-sm text-neutral-500">Espaço reservado para análise de cores, peças e sugestões de looks. A inteligência artificial está desativada até escolhermos e configurarmos o provedor.</p></div>}
      </main>
    </div>
  </div>;
}
