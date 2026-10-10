import { collection, documentId, getDocs, limit, orderBy, query, startAfter, where, type Firestore, type QueryConstraint } from 'firebase/firestore';
import { boundedPageSize, type FeedFilters, type Page, type Post } from '../domain/social';

/** Prepared adapter, NOT connected to the UI until Auth and rules are tested.
 * Cursor includes the same sort keys used by the query, so no extra getDoc/read.
 * Cursor tokens are untrusted; server/rules must still enforce authorization.
 */
type Cursor = {createdAt:number;id:string};
function parseCursor(raw:string):Cursor {
  if(raw.length>512) throw new Error('Cursor inválido');
  try {
    const decoded=JSON.parse(atob(raw)) as Cursor;
    if(!Number.isFinite(decoded.createdAt)||typeof decoded.id!=='string'||!decoded.id||decoded.id.length>256||decoded.id.includes('/')) throw Error();
    return decoded;
  } catch { throw new Error('Cursor inválido'); }
}
export class FirestorePostReader {
  constructor(private readonly db:Firestore) {}
  async getPublicPosts(filters:FeedFilters={}):Promise<Page<Post>> {
    const max=boundedPageSize(filters.limit);
    const constraints:QueryConstraint[]=[where('visibility','==','public')];
    if(filters.topic) constraints.push(where('topic','==',filters.topic));
    if(filters.authorUid) constraints.push(where('authorUid','==',filters.authorUid));
    constraints.push(orderBy('createdAt','desc'),orderBy(documentId(),'desc'));
    if(filters.cursor) {
      const cursor=parseCursor(filters.cursor);
      constraints.push(startAfter(cursor.createdAt,cursor.id));
    }
    constraints.push(limit(max+1));
    const docs=(await getDocs(query(collection(this.db,'posts'),...constraints))).docs;
    const selected=docs.slice(0,max);
    const items=selected.map(d=>({...d.data(),id:d.id} as Post));
    const last=selected[selected.length-1];
    const nextCursor=docs.length>max&&last?btoa(JSON.stringify({createdAt:last.get('createdAt'),id:last.id} satisfies Cursor)):null;
    return {items,nextCursor};
  }
}
