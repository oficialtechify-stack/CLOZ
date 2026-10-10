/**
 * CLOZ scalable social domain. No Firestore operations here.
 * All private records must be scoped to authenticated UID.
 */
export type UID = string;
export type Topic = 'programacao'|'moda'|'games'|'arte'|'musica'|'outros';
export type Visibility = 'public'|'followers'|'private';
export type Media = {type:'image'|'video';storagePath:string;thumbnailPath?:string;alt?:string};
export type MusicReference = {provider:'spotify'|'deezer'|'other';trackId:string;title:string;artist:string;previewUrl?:string};
export type Profile = {
  uid:UID; handle:string; displayName:string; bio:string; avatarPath?:string;
  coverPath?:string; interests:Topic[]; technologies?:string[];
  privacy:'public'|'private'; createdAt:number;
};
export type Post = {
  id:string; authorUid:UID; kind:'text'|'look'|'project'|'image'|'video';
  content:string; topic:Topic; visibility:Visibility; media?:Media[];
  music?:MusicReference; projectUrl?:string; repostOf?:string;
  createdAt:number; updatedAt?:number;
};
export type Story = {id:string;authorUid:UID;media:Media;createdAt:number;expiresAt:number;visibility:Visibility};
export type ClosetItem = {id:string;ownerUid:UID;name:string;category:string;media?:Media;visibility:Visibility;createdAt:number};
export type Comment = {id:string;postId:string;authorUid:UID;body:string;createdAt:number;parentId?:string};
export type Follow = {followerUid:UID;followedUid:UID;createdAt:number;status:'following'|'requested'};
export type Conversation = {id:string;memberUids:UID[];updatedAt:number;lastMessagePreview?:string};
export type Message = {id:string;conversationId:string;senderUid:UID;body?:string;media?:Media;createdAt:number};
export type Playlist = {id:string;ownerUid:UID;name:string;trackIds:string[];visibility:Visibility;createdAt:number};
export type MusicSyncInvite = {id:string;fromUid:UID;toUid:UID;playlistId:string;status:'pending'|'accepted'|'declined';createdAt:number};
export type MusicSyncGroup = {id:string;memberUids:UID[];playlistId:string;createdAt:number};
export type Notification = {id:string;recipientUid:UID;actorUid?:UID;type:'follow'|'like'|'comment'|'repost'|'message'|'invite';resourceId?:string;createdAt:number;readAt?:number};
export type Page<T> = {items:T[];nextCursor:string|null};
export type FeedFilters = {topic?:Topic;authorUid?:UID;limit?:number;cursor?:string};
export interface SocialRepository {
  getProfile(uid:UID):Promise<Profile|null>;
  getFeed(filters:FeedFilters):Promise<Page<Post>>;
  getComments(postId:string,cursor?:string):Promise<Page<Comment>>;
  getStories(authorUid:UID,cursor?:string):Promise<Page<Story>>;
  getCloset(ownerUid:UID,cursor?:string):Promise<Page<ClosetItem>>;
  getConversations(userUid:UID,cursor?:string):Promise<Page<Conversation>>;
  getMessages(conversationId:string,cursor?:string):Promise<Page<Message>>;
  getNotifications(userUid:UID,cursor?:string):Promise<Page<Notification>>;
  getPlaylists(ownerUid:UID,cursor?:string):Promise<Page<Playlist>>;
}
export const DEFAULT_PAGE_SIZE=15;
export const MAX_PAGE_SIZE=30;
export function boundedPageSize(size:number=DEFAULT_PAGE_SIZE):number {
  if (!Number.isFinite(size)) return DEFAULT_PAGE_SIZE;
  return Math.max(1,Math.min(MAX_PAGE_SIZE,Math.floor(size)));
}
