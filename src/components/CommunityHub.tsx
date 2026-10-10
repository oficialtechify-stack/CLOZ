import React, { useMemo, useState } from 'react';
import { Bookmark, Code2, Compass, Heart, MessageCircle, Plus, Search, Send, Users, Repeat2, Music2 } from 'lucide-react';

/**
 * CLOZ Community Hub — protótipo offline.
 * Funciona sem Firebase, serviços externos ou dados de usuários reais.
 * Não conectar a uma rota pública antes da revisão visual.
 */
export type CommunityTopic = 'Todos' | 'Programação' | 'Moda' | 'Games' | 'Arte' | 'Música';
type ContentType = 'texto' | 'projeto' | 'foto' | 'vídeo';
type Post = {
  id: string; author: string; topic: Exclude<CommunityTopic, 'Todos'>;
  kind: ContentType; body: string; repository?: string; likes: number;
  liked: boolean; saved: boolean; comments: string[]; music?: string; repostOf?: string;
};
const topics: CommunityTopic[] = ['Todos','Programação','Moda','Games','Arte','Música'];
const seed: Post[] = [
  { id:'demo-1', author:'dev.lia', topic:'Programação', kind:'projeto', body:'Meu primeiro projeto open source: um painel acessível feito com React. Alguém quer colaborar?', repository:'https://github.com', likes:42, liked:false, saved:false, comments:['Curti a iniciativa!'] },
  { id:'demo-2', author:'rafa.street', topic:'Moda', kind:'foto', body:'Explorando novas combinações e compartilhando referências para a semana.', likes:19, liked:false, saved:false, comments:[] },
  { id:'demo-3', author:'pixel.ana', topic:'Games', kind:'texto', body:'Qual jogo indie te inspirou a criar seu primeiro projeto?', likes:31, liked:false, saved:false, comments:[] }
];
function validHttpUrl(value: string) {
  try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:'; } catch { return false; }
}
export default function CommunityHub() {
  const [posts, setPosts] = useState<Post[]>(seed);
  const [topic, setTopic] = useState<CommunityTopic>('Todos');
  const [screen, setScreen] = useState<'feed' | 'communities' | 'profile'>('feed');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [draftTopic, setDraftTopic] = useState<Exclude<CommunityTopic,'Todos'>>('Programação');
  const [draftKind, setDraftKind] = useState<ContentType>('texto');
  const [repository, setRepository] = useState('');
  const [music, setMusic] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('meu.perfil');
  const [commentDrafts, setCommentDrafts] = useState<Record<string,string>>({});
  const [following, setFollowing] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState('Meu perfil');
  const [bio, setBio] = useState('Compartilho projetos e tudo de que gosto.');
  const [technologies, setTechnologies] = useState('React, JavaScript');
  const [editing, setEditing] = useState(false);
  const [joined, setJoined] = useState<string[]>(['Programação']);
  const visible = useMemo(() => posts.filter(p => (topic === 'Todos' || p.topic === topic) &&
    (p.author + ' ' + p.body + ' ' + p.topic).toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))), [posts, topic, search]);
  const edit = (id:string, change:(p:Post)=>Post) => setPosts(all => all.map(p => p.id === id ? change(p) : p));
  const publish = () => {
    if (!draft.trim() || (draftKind === 'projeto' && repository.trim() && !validHttpUrl(repository.trim()))) return;
    setPosts(all => [{ id: crypto.randomUUID(), author: 'meu.perfil', body: draft.trim(), topic: draftTopic,
      kind: draftKind, repository: draftKind === 'projeto' ? repository.trim() || undefined : undefined, music: music.trim() || undefined,
      likes:0, liked:false, saved:false, comments:[] }, ...all]);
    setDraft(''); setRepository(''); setMusic(''); setTopic('Todos'); setScreen('feed');
  };
  const repost = (post:Post) => setPosts(all => [{...post, id:crypto.randomUUID(), author:'meu.perfil', repostOf:post.author, liked:false, saved:false, likes:0, comments:[]}, ...all]);
  return <section className="mx-auto w-full max-w-5xl px-4 py-8 text-[#171717]">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-3xl font-semibold tracking-tight">Comunidade CLOZ</h1><p className="mt-1 text-sm text-neutral-500">Todos os interesses, um só lugar. Protótipo offline.</p></div>
      <span className="rounded-full bg-neutral-100 px-3 py-2 text-xs text-neutral-600">Dados de demonstração • não salvos</span>
    </div>
    <nav aria-label="Seções da comunidade" className="mb-6 flex gap-2 border-b border-neutral-200 pb-4">
      {([['feed','Feed',Compass],['communities','Comunidades',Users],['profile','Meu perfil',Code2]] as const).map(([key,label,Icon]) =>
        <button key={key} onClick={()=>setScreen(key)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${screen===key?'bg-black text-white':'bg-neutral-100'}`}><Icon size={16}/>{label}</button>)}
    </nav>
    {screen === 'feed' && <div className="grid items-start gap-6 md:grid-cols-[1fr_230px]">
      <div className="min-w-0 space-y-5">
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold">Criar publicação</h2>
          <textarea aria-label="Texto da publicação" maxLength={2000} rows={3} value={draft} onChange={e=>setDraft(e.target.value)} className="w-full resize-y rounded-xl border border-neutral-200 p-3 text-sm" placeholder="Compartilhe uma ideia, projeto ou inspiração..."/>
          <div className="mt-3 flex flex-wrap gap-2">
            <select aria-label="Comunidade da publicação" value={draftTopic} onChange={e=>setDraftTopic(e.target.value as Exclude<CommunityTopic,'Todos'>)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">{topics.slice(1).map(t=><option key={t}>{t}</option>)}</select>
            <select aria-label="Tipo de conteúdo" value={draftKind} onChange={e=>setDraftKind(e.target.value as ContentType)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">{(['texto','projeto','foto','vídeo'] as const).map(t=><option key={t} value={t}>{t}</option>)}</select>
          </div>
          {draftKind==='projeto' && <input aria-label="Link do projeto" value={repository} onChange={e=>setRepository(e.target.value)} className="mt-3 w-full rounded-lg border border-neutral-200 p-3 text-sm" placeholder="Link do projeto (opcional): https://..."/>}
          <label className="mt-3 flex items-center gap-2 rounded-lg border border-neutral-200 p-3 text-sm"><Music2 size={17}/><input value={music} maxLength={140} onChange={e=>setMusic(e.target.value)} className="min-w-0 flex-1 outline-none" placeholder="Música do post: artista — faixa (opcional)" aria-label="Música do post"/></label>
          {(draftKind==='foto'||draftKind==='vídeo') && <p className="mt-2 text-xs text-neutral-500">O envio de mídia será integrado após a fase visual.</p>}
          <button disabled={!draft.trim() || (draftKind==='projeto' && !!repository.trim() && !validHttpUrl(repository.trim()))} onClick={publish} className="mt-4 flex items-center gap-2 rounded-full bg-black px-5 py-2 text-sm text-white disabled:opacity-40"><Plus size={16}/> Publicar teste</button>
        </div>
        <label className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-3"><Search size={18}/><input className="min-w-0 flex-1 outline-none" placeholder="Buscar na comunidade" value={search} onChange={e=>setSearch(e.target.value)}/></label>
        <div aria-label="Filtrar conteúdos" className="flex gap-2 overflow-auto pb-2">{topics.map(t=><button key={t} onClick={()=>setTopic(t)} className={`shrink-0 rounded-full px-4 py-2 text-xs ${topic===t?'bg-black text-white':'bg-neutral-100'}`}>{t}</button>)}</div>
        {visible.length === 0 && <div className="rounded-xl bg-white p-8 text-sm">Nenhuma publicação encontrada.</div>}
        {visible.map(post=><article key={post.id} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><button className="font-semibold hover:underline" onClick={()=>{setSelectedProfile(post.author);setScreen('profile')}}>@{post.author}</button><span className="ml-2 text-xs text-neutral-500">{post.topic} · {post.kind}</span></div><button onClick={()=>setFollowing(a=>a.includes(post.author)?a.filter(x=>x!==post.author):[...a,post.author])} className="rounded-full border border-neutral-200 px-3 py-1 text-xs">{following.includes(post.author)?'Seguindo':'Seguir'}</button></div>
          <p className="my-5 whitespace-pre-wrap break-words text-sm leading-6">{post.body}</p>
          {post.repostOf && <p className="mb-2 text-xs text-neutral-500">Repost de @{post.repostOf}</p>}
          {post.music && <p className="mb-3 flex items-center gap-2 rounded-lg bg-[#F2F0ED] p-3 text-xs"><Music2 size={15}/>{post.music} · faixa vinculada, sem reprodução</p>}
          {post.repository && <a href={post.repository} target="_blank" rel="noopener noreferrer" className="mb-4 block truncate rounded-lg bg-neutral-100 p-3 text-sm underline">{post.repository}</a>}
          <div className="flex items-center gap-5 border-t border-neutral-100 pt-4">
            <button aria-label="Curtir" onClick={()=>edit(post.id,p=>({...p,liked:!p.liked,likes:p.likes+(p.liked?-1:1)}))} className="flex items-center gap-1 text-sm"><Heart size={18} fill={post.liked?'currentColor':'none'}/>{post.likes}</button>
            <span className="flex items-center gap-1 text-sm"><MessageCircle size={18}/>{post.comments.length}</span>
            <button aria-label="Repostar" onClick={()=>repost(post)} className="flex items-center gap-1 text-sm"><Repeat2 size={18}/>Repost</button>
            <button aria-label={post.saved?'Remover dos salvos':'Salvar'} onClick={()=>edit(post.id,p=>({...p,saved:!p.saved}))}><Bookmark size={18} fill={post.saved?'currentColor':'none'}/></button>
          </div>
          {post.comments.map((comment,i)=><p key={i} className="mt-3 rounded-lg bg-neutral-50 p-3 text-sm">{comment}</p>)}
          <div className="mt-4 flex gap-2"><input aria-label="Escrever comentário" maxLength={500} className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm" placeholder="Escrever comentário" value={commentDrafts[post.id]||''} onChange={e=>setCommentDrafts(d=>({...d,[post.id]:e.target.value}))}/><button aria-label="Enviar comentário" onClick={()=>{const value=commentDrafts[post.id]?.trim();if(value) edit(post.id,p=>({...p,comments:[...p.comments,value]}));setCommentDrafts(d=>({...d,[post.id]:''}));}}><Send size={18}/></button></div>
        </article>)}
      </div>
      <aside className="hidden rounded-2xl bg-white p-5 md:block"><h2 className="font-semibold">Descubra interesses</h2><p className="my-3 text-xs text-neutral-500">Programação em destaque no lançamento, sem excluir outras comunidades.</p>{topics.slice(1).map(t=><button key={t} className="block w-full rounded-lg px-2 py-3 text-left text-sm hover:bg-neutral-100" onClick={()=>setTopic(t)}>{t}</button>)}</aside>
    </div>}
    {screen==='communities' && <div className="grid gap-3 sm:grid-cols-2">{topics.slice(1).map(t=><div key={t} className="rounded-2xl bg-white p-5"><h2 className="text-lg font-semibold">{t}</h2><p className="my-3 text-sm text-neutral-500">{t==='Programação'?'Projetos, carreira, colaboração e código.':'Um espaço para compartilhar interesses e conhecer pessoas.'}</p><button onClick={()=>setJoined(a=>a.includes(t)?a.filter(x=>x!==t):[...a,t])} className="rounded-full bg-black px-4 py-2 text-xs text-white">{joined.includes(t)?'Sair da comunidade':'Participar'}</button></div>)}</div>}
    {screen==='profile' && <div className="mb-3 max-w-2xl"><label className="block text-xs text-neutral-500">Visualizar perfil de <select aria-label="Selecionar perfil demonstrativo" value={selectedProfile} onChange={e=>setSelectedProfile(e.target.value)} className="ml-2 rounded-lg border px-3 py-2 text-sm">{Array.from(new Set(['meu.perfil',...posts.map(p=>p.author)])).map(name=><option key={name} value={name}>@{name}</option>)}</select></label></div>}
    {screen==='profile' && <div className="max-w-2xl rounded-2xl bg-white p-6">
      <div className="mb-5 h-24 rounded-xl bg-[#d3cdc3]"/>
      <div className="-mt-12 mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-neutral-800 text-2xl text-white">C</div>
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">{selectedProfile==='meu.perfil'?displayName:selectedProfile}</h2><p className="text-sm text-neutral-500">@{selectedProfile}</p></div>{selectedProfile==='meu.perfil' && <button onClick={()=>setEditing(v=>!v)} className="rounded-full border px-4 py-2 text-sm">{editing?'Fechar edição':'Editar perfil'}</button>}</div>
      {editing && selectedProfile==='meu.perfil' && <div className="my-5 space-y-3 rounded-xl bg-[#F7F6F3] p-4">
        <label className="block text-xs">Nome<input value={displayName} onChange={e=>setDisplayName(e.target.value)} maxLength={80} className="mt-1 w-full rounded-lg border p-3 text-sm"/></label>
        <label className="block text-xs">Biografia<textarea value={bio} onChange={e=>setBio(e.target.value)} maxLength={500} rows={3} className="mt-1 w-full rounded-lg border p-3 text-sm"/></label>
        <label className="block text-xs">Tecnologias (opcional)<input value={technologies} onChange={e=>setTechnologies(e.target.value)} maxLength={150} className="mt-1 w-full rounded-lg border p-3 text-sm"/></label>
        <button onClick={()=>setEditing(false)} className="rounded-full bg-black px-4 py-2 text-sm text-white">Concluir edição local</button>
      </div>}
      <p className="mt-3 whitespace-pre-wrap text-sm text-neutral-600">{selectedProfile==='meu.perfil'?bio:'Perfil demonstrativo da comunidade CLOZ.'}</p>
      {selectedProfile==='meu.perfil' && technologies.trim() && <div className="mt-4 flex flex-wrap gap-2">{technologies.split(',').map(x=>x.trim()).filter(Boolean).map((name,i)=><span key={i} className="rounded-full bg-[#EAE8E1] px-3 py-1 text-xs">{name}</span>)}</div>}
      <p className="mt-4 text-sm">{posts.filter(p=>p.author===selectedProfile).length} publicações · {joined.length} comunidades</p>
      <h3 className="mt-6 font-semibold">Meus projetos e publicações</h3>
      <div className="mt-2 space-y-2">{posts.filter(p=>p.author==='meu.perfil').length===0 && <p className="rounded-lg bg-neutral-100 p-3 text-sm text-neutral-500">Publique algo no feed para aparecer aqui.</p>}{posts.filter(p=>p.author==='meu.perfil').map(p=><div className="rounded-lg bg-neutral-100 p-3 text-sm" key={p.id}><span className="text-xs text-neutral-500">{p.topic} · {p.kind}</span><p className="mt-1 whitespace-pre-wrap">{p.body}</p>{p.repository && <a href={p.repository} rel="noopener noreferrer" target="_blank" className="mt-2 block underline">Abrir projeto</a>}</div>)}</div>
    </div>}
  </section>;
}
