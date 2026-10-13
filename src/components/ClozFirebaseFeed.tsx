import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, type User } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { Heart, MessageCircle, Send, LogOut } from 'lucide-react';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';

type Post = { id:string; uid:string; author:string; text:string; createdAt?: {seconds:number} };
export default function ClozFirebaseFeed(){
 const [user,setUser]=useState<User|null>(null);
 const [ready,setReady]=useState(false);
 const [posts,setPosts]=useState<Post[]>([]);
 const [text,setText]=useState('');
 const [error,setError]=useState('');
 const [busy,setBusy]=useState(false);
 const [likes,setLikes]=useState<string[]>([]);
 const [comments,setComments]=useState<Record<string,string[]>>({});
 const [drafts,setDrafts]=useState<Record<string,string>>({});
 const [openComments,setOpenComments]=useState<string[]>([]);
 useEffect(()=>{if(!isFirebaseConfigured){setReady(true);return;}return onAuthStateChanged(auth,u=>{setUser(u);setReady(true);});},[]);
 async function refresh(){
   try {
     const snap=await getDocs(query(collection(db,'cloz_posts'),orderBy('createdAt','desc'),limit(30)));
     setPosts(snap.docs.map(d=>({id:d.id,...d.data()} as Post)));
     setError('');
   }catch(e){setError('Não foi possível carregar publicações. Verifique as regras do Firestore.');}
 }
 useEffect(()=>{if(user)void refresh();else setPosts([]);},[user]);
 useEffect(()=>{if(!user||!posts.length)return;let active=true;
   void Promise.all(posts.map(async p=>{
     const [ls,cs]=await Promise.all([getDocs(collection(db,'cloz_posts',p.id,'likes')),getDocs(query(collection(db,'cloz_posts',p.id,'comments'),orderBy('createdAt','asc'),limit(50)))]);
     return {id:p.id,liked:ls.docs.some(d=>d.id===user.uid),comments:cs.docs.map(d=>String(d.data().text||''))};
   })).then(rows=>{if(active){setLikes(rows.filter(r=>r.liked).map(r=>r.id));setComments(Object.fromEntries(rows.map(r=>[r.id,r.comments])));}}).catch(()=>setError('Não foi possível carregar interações.'));
   return()=>{active=false};
 },[user,posts]);
 async function publish(){if(!user||!text.trim()||busy)return;setBusy(true);setError('');try{
   await addDoc(collection(db,'cloz_posts'),{uid:user.uid,author:user.displayName||'Usuário CLOZ',text:text.trim().slice(0,2000),createdAt:serverTimestamp()});
   setText('');await refresh();
 }catch{setError('Falha ao publicar. Verifique suas permissões no Firebase.')}finally{setBusy(false)}}
 async function toggleLike(p:Post){if(!user)return;try{const ref=doc(db,'cloz_posts',p.id,'likes',user.uid);if(likes.includes(p.id)){await deleteDoc(ref);setLikes(v=>v.filter(x=>x!==p.id))}else{await setDoc(ref,{uid:user.uid,createdAt:serverTimestamp()});setLikes(v=>[...v,p.id])}}catch{setError('Não foi possível atualizar a curtida.')}}
 async function comment(p:Post){if(!user||!drafts[p.id]?.trim())return;try{await addDoc(collection(db,'cloz_posts',p.id,'comments'),{uid:user.uid,author:user.displayName||'Usuário CLOZ',text:drafts[p.id].trim().slice(0,500),createdAt:serverTimestamp()});setComments(v=>({...v,[p.id]:[...(v[p.id]||[]),drafts[p.id].trim()]}));setDrafts(v=>({...v,[p.id]:''}));}catch{setError('Não foi possível comentar.')}}
 if(!isFirebaseConfigured)return <p role="alert" className="rounded-xl border border-amber-500/40 p-5 text-amber-200">Firebase não configurado. Adicione as variáveis VITE_FIREBASE_* do projeto CLOZ na Vercel. Nenhuma publicação fictícia será exibida.</p>;
 if(!ready)return <p className="p-8 text-center text-[#aaa]">Carregando...</p>;
 if(!user)return <section className="rounded-2xl border border-[#333] bg-[#141414] p-8 text-center"><h2 className="text-xl font-bold">Entre no CLOZ</h2><p className="my-4 text-sm text-[#aaa]">Entre com sua conta para ver e publicar conteúdos reais.</p><button className="rounded-full bg-white px-6 py-3 font-semibold text-black" onClick={()=>signInWithPopup(auth,new GoogleAuthProvider()).catch(()=>setError('Não foi possível entrar com Google.'))}>Entrar com Google</button>{error&&<p role="alert" className="mt-4 text-red-300">{error}</p>}</section>;
 return <section className="space-y-4"><div className="flex items-center justify-between text-xs text-[#aaa]"><span>Publicações da comunidade</span><button onClick={()=>signOut(auth)} className="flex items-center gap-1"><LogOut size={14}/> Sair</button></div>
 <div className="rounded-2xl border border-[#303030] bg-[#141414] p-4"><textarea aria-label="Criar publicação" placeholder="O que há de novo?" maxLength={2000} value={text} onChange={e=>setText(e.target.value)} className="min-h-24 w-full resize-y bg-transparent text-white outline-none"/><div className="flex justify-end"><button disabled={!text.trim()||busy} onClick={publish} className="rounded-full bg-white px-5 py-2 font-semibold text-black disabled:opacity-50">{busy?'Publicando...':'Publicar'}</button></div></div>
 {error&&<p role="alert" className="rounded-lg border border-red-500/40 p-3 text-sm text-red-300">{error}</p>}
 {posts.length===0&&!error&&<p className="py-16 text-center text-[#999]">Ainda não há publicações. Seja o primeiro a postar!</p>}
 {posts.map(p=><article key={p.id} className="rounded-2xl border border-[#303030] bg-[#141414] p-5"><p className="font-semibold">{p.author}</p><p className="mt-4 whitespace-pre-wrap break-words text-sm">{p.text}</p><div className="mt-5 flex gap-5 border-t border-[#333] pt-3"><button aria-label="Curtir" aria-pressed={likes.includes(p.id)} onClick={()=>toggleLike(p)} className="flex items-center gap-2"><Heart size={18} fill={likes.includes(p.id)?'currentColor':'none'}/></button><button onClick={()=>setOpenComments(v=>v.includes(p.id)?v.filter(x=>x!==p.id):[...v,p.id])} className="flex items-center gap-2"><MessageCircle size={18}/>{comments[p.id]?.length||0}</button></div>{openComments.includes(p.id)&&<div className="mt-4 space-y-3">{(comments[p.id]||[]).map((c,i)=><p key={i} className="rounded-lg bg-[#242424] p-3 text-sm">{c}</p>)}<div className="flex gap-2"><input aria-label="Escrever comentário" value={drafts[p.id]||''} maxLength={500} onChange={e=>setDrafts(v=>({...v,[p.id]:e.target.value}))} className="min-w-0 flex-1 rounded-lg bg-[#242424] p-3 text-sm" placeholder="Comentar..."/><button aria-label="Enviar comentário" onClick={()=>comment(p)}><Send size={20}/></button></div></div>}</article>)}</section>
}
