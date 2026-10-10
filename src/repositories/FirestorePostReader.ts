import { collection, documentId, getDocs, limit, orderBy, query, startAfter, where, type DocumentData, type DocumentSnapshot, type Firestore, type QueryConstraint } from 'firebase/firestore';
import { boundedPageSize, type FeedFilters, type Page, type Post, type Topic } from '../domain/social';

/**
 * Firestore adapter prepared for future integration. NOT instantiated by the UI.
 * Cursor is the document ID of the last visible post; fetching it requires one
 * additional document read per page. Later we can use an opaque, signed cursor.
 * Requires matching Firestore indexes and tested security rules before enabling.
 */
export class FirestorePostReader {
  constructor(private readonly db:Firestore) {}

  async getPublicPosts(filters:FeedFilters = {}):Promise<Page<Post>> {
    const max=boundedPageSize(filters.limit);
    const constraints:QueryConstraint[]=[where('visibility','==','public')];
    if (filters.topic) constraints.push(where('topic','==',filters.topic));
    if (filters.authorUid) constraints.push(where('authorUid','==',filters.authorUid));
    constraints.push(orderBy('createdAt','desc'),orderBy(documentId(),'desc'));
    if (filters.cursor) {
      // Reject unreasonable/malformed cursor input early.
      if (filters.cursor.length>256 || filters.cursor.includes('/')) throw new Error('Cursor inválido');
      const previous=await import('firebase/firestore').then(m=>m.getDoc(m.doc(this.db,'posts',filters.cursor!)));
      if (!previous.exists()) throw new Error('Cursor expirado');
      constraints.push(startAfter(previous as DocumentSnapshot<DocumentData>));
    }
    constraints.push(limit(max+1));
    const snapshot=await getDocs(query(collection(this.db,'posts'),...constraints));
    const docs=snapshot.docs;
    const more=docs.length>max;
    const items=docs.slice(0,max).map(d=>({...d.data(),id:d.id} as Post));
    return {items,nextCursor:more?docs[max-1].id:null};
  }
}
