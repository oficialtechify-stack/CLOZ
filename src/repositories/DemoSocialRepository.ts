import {boundedPageSize, type Page, type Post, type FeedFilters, type SocialRepository, type Profile, type Comment, type Story, type ClosetItem, type Conversation, type Message, type Notification, type Playlist, type UID} from '../domain/social';

/** Offline repository for UI development; not a replacement for an authenticated backend. */
export class DemoSocialRepository implements SocialRepository {
  constructor(private readonly profiles: Profile[]=[],private readonly posts:Post[]=[]) {}
  async getProfile(uid:UID):Promise<Profile|null> {
    return this.profiles.find(p=>p.uid===uid)??null;
  }
  async getFeed(filters:FeedFilters):Promise<Page<Post>> {
    const sorted=this.posts.filter(p=>p.visibility==='public'&&(!filters.topic||p.topic===filters.topic)&&(!filters.authorUid||p.authorUid===filters.authorUid))
      .sort((a,b)=>b.createdAt-a.createdAt||b.id.localeCompare(a.id));
    return paginate(sorted,filters.cursor,boundedPageSize(filters.limit));
  }
  getComments(_postId:string,cursor?:string):Promise<Page<Comment>> {return Promise.resolve(paginate([],cursor));}
  getStories(_authorUid:UID,cursor?:string):Promise<Page<Story>> {return Promise.resolve(paginate([],cursor));}
  getCloset(_ownerUid:UID,cursor?:string):Promise<Page<ClosetItem>> {return Promise.resolve(paginate([],cursor));}
  getConversations(_userUid:UID,cursor?:string):Promise<Page<Conversation>> {return Promise.resolve(paginate([],cursor));}
  getMessages(_conversationId:string,cursor?:string):Promise<Page<Message>> {return Promise.resolve(paginate([],cursor));}
  getNotifications(_userUid:UID,cursor?:string):Promise<Page<Notification>> {return Promise.resolve(paginate([],cursor));}
  getPlaylists(_ownerUid:UID,cursor?:string):Promise<Page<Playlist>> {return Promise.resolve(paginate([],cursor));}
}
/** Offset cursor is restricted to local sample data. Firestore implementation must use document cursors. */
export function paginate<T>(items:T[],cursor?:string|null,pageSize:number=15):Page<T> {
  const parsed=cursor===undefined||cursor===null?0:Number(cursor);
  const offset=Number.isSafeInteger(parsed)&&parsed>=0?parsed:0;
  const size=boundedPageSize(pageSize);
  const page=items.slice(offset,offset+size);
  const next=offset+size<items.length?String(offset+size):null;
  return {items:page,nextCursor:next};
}
