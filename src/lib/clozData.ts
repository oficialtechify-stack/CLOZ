import { auth, db, isMocked } from './firebase';
import {
  addDoc, collection, doc, getDocs, limit, orderBy, query,
  runTransaction, serverTimestamp, startAfter, updateDoc, where,
  type DocumentData, type QueryDocumentSnapshot,
} from 'firebase/firestore';

/**
 * Real CLOZ data access. No realtime listeners or startup reads.
 * Requires authentication, verified project configuration and deployed Firestore rules.
 * Do not use with the old Firebase project or the demo fallback.
 */
export const CLOZ_PROJECT_ID = 'cloz-4115a';
const PAGE_SIZE = 15;
const text = (value: string, max: number) => value.trim().slice(0, max);

function currentUserId(): string {
  const user = auth.currentUser;
  if (!user) throw new Error('Entre na sua conta para continuar.');
  if (isMocked || db.app.options.projectId !== CLOZ_PROJECT_ID)
    throw new Error('Firebase do CLOZ não configurado para o projeto correto.');
  return user.uid;
}

export type ClozPost = {
  id: string;
  authorId: string;
  body: string;
  topic: string;
  createdAt: unknown;
  likeCount: number;
  commentCount: number;
};

export async function createPost(body: string, topic: string) {
  const authorId = currentUserId();
  const cleanBody = text(body, 2000);
  const cleanTopic = text(topic, 40);
  if (!cleanBody || !cleanTopic) throw new Error('Preencha o texto e a comunidade.');
  return addDoc(collection(db, 'posts'), {
    authorId, body: cleanBody, topic: cleanTopic,
    createdAt: serverTimestamp(), likeCount: 0, commentCount: 0,
  });
}

export async function loadFeed(cursor?: QueryDocumentSnapshot<DocumentData>) {
  currentUserId();
  const feed = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    ...(cursor ? [startAfter(cursor)] : []),
    limit(PAGE_SIZE),
  );
  const snapshot = await getDocs(feed);
  return {
    posts: snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as ClozPost),
    nextCursor: snapshot.docs.length === PAGE_SIZE ? snapshot.docs[snapshot.docs.length - 1] : null,
  };
}

export async function loadMyPosts() {
  const uid = currentUserId();
  const snapshot = await getDocs(query(
    collection(db, 'posts'), where('authorId', '==', uid),
    orderBy('createdAt', 'desc'), limit(PAGE_SIZE),
  ));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as ClozPost);
}

export async function toggleLike(postId: string) {
  const uid = currentUserId();
  const postRef = doc(db, 'posts', postId);
  const likeRef = doc(db, 'posts', postId, 'likes', uid);
  return runTransaction(db, async tx => {
    const [post, like] = await Promise.all([tx.get(postRef), tx.get(likeRef)]);
    if (!post.exists()) throw new Error('Publicação não encontrada.');
    const wasLiked = like.exists();
    const count = Math.max(0, Number(post.data().likeCount || 0) + (wasLiked ? -1 : 1));
    if (wasLiked) tx.delete(likeRef);
    else tx.set(likeRef, { userId: uid, createdAt: serverTimestamp() });
    tx.update(postRef, { likeCount: count });
    return !wasLiked;
  });
}

export async function addComment(postId: string, body: string) {
  const uid = currentUserId();
  const cleanBody = text(body, 500);
  if (!cleanBody) throw new Error('Escreva um comentário.');
  const postRef = doc(db, 'posts', postId);
  const commentRef = doc(collection(db, 'posts', postId, 'comments'));
  await runTransaction(db, async tx => {
    const post = await tx.get(postRef);
    if (!post.exists()) throw new Error('Publicação não encontrada.');
    tx.set(commentRef, { authorId: uid, body: cleanBody, createdAt: serverTimestamp() });
    tx.update(postRef, { commentCount: Number(post.data().commentCount || 0) + 1 });
  });
  return commentRef.id;
}

export async function loadComments(postId: string) {
  currentUserId();
  const snapshot = await getDocs(query(
    collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'), limit(30),
  ));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
}

export async function updateMyProfile(displayName: string, bio: string) {
  const uid = currentUserId();
  const name = text(displayName, 80);
  if (!name) throw new Error('Informe seu nome.');
  return updateDoc(doc(db, 'users', uid), { displayName: name, bio: text(bio, 500), updatedAt: serverTimestamp() });
}

