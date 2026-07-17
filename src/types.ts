export interface TaggedItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  forSale: boolean;
  buyUrl?: string;
  category: 'Jeans' | 'Jaqueta' | 'Camiseta' | 'Sapato' | 'Acessório' | 'Outros';
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  croppedImage?: string; // base64 representation of cropped/cut out item
  cleanEcomImage?: string; // clean studio/e-commerce background image
}

export interface Look {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  image: string;
  title: string;
  description: string;
  tags: TaggedItem[];
  likes: number;
  likedBy: string[];
  views: number;
  auraScore: number;
  date: string; // ISO date or "YYYY-MM-DD"
  commentsCount: number;
  location: string;
  aesthetics: string[];
}

export interface ClosetItem {
  id: string;
  userId: string;
  name: string;
  category: 'Jeans' | 'Jaqueta' | 'Camiseta' | 'Sapato' | 'Acessório' | 'Outros';
  brand: string;
  price: number;
  image: string;
  forSale: boolean;
  isNew?: boolean;
  boughtAt: string; // Date string
  timesWorn: number;
  costPerWear: number; // Price / timesWorn
  croppedImage?: string;
  cleanEcomImage?: string;
}

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  location: string;
  followersCount: number;
  followingCount: number;
  auraScore: number;
  totalOutfits: number;
  instagram?: string;
  whatsapp?: string;
  following?: string[];
  followers?: string[];
}

export interface AppNotification {
  id: string;
  type: 'like' | 'follow' | 'comment' | 'sale';
  fromUser: {
    username: string;
    avatar: string;
  };
  title: string;
  subtitle: string;
  lookImage?: string;
  auraAdded?: number;
  timestamp: string; // e.g. "1m atrás"
}

export interface AestheticCategory {
  id: string;
  name: string;
  count: string;
  image: string;
}
