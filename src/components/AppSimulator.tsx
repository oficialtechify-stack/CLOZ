import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, Plus, Search, User, Calendar as CalendarIcon, 
  Bell, Share2, Camera, MapPin, Tag, ExternalLink, ShoppingBag, 
  Filter, ArrowLeft, Trash, PlusCircle, X, DollarSign, Check, ChevronRight, Smartphone, LogOut,
  Grid, BookOpen, Sparkles, Zap, SlidersHorizontal, Maximize2, Shirt
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Look, ClosetItem, UserProfile, AppNotification, AestheticCategory, TaggedItem } from '../types';
import { SEED_AESTHETICS, SEED_LOOKS, SEED_CLOSET, SEED_OTHER_USERS, SEED_NOTIFICATIONS } from '../data';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, doc, setDoc, getDoc, getDocs, updateDoc, 
  onSnapshot, query, where, orderBy, deleteDoc, limit
} from 'firebase/firestore';
import AuthScreen from './AuthScreen';

const cropImagePiece = (
  imageSrc: string,
  box: [number, number, number, number] // [ymin, xmin, ymax, xmax] (0 to 1000)
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const H = img.naturalHeight;
      const W = img.naturalWidth;
      
      const [ymin, xmin, ymax, xmax] = box;
      const yStart = (ymin / 1000) * H;
      const xStart = (xmin / 1000) * W;
      const yEnd = (ymax / 1000) * H;
      const xEnd = (xmax / 1000) * W;
      
      const cropW = Math.max(10, xEnd - xStart);
      const cropH = Math.max(10, yEnd - yStart);
      
      const canvas = document.createElement("canvas");
      canvas.width = 450;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        resolve(imageSrc);
        return;
      }
      
      ctx.fillStyle = "#F6F6F6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const maxFitW = 340;
      const maxFitH = 460;
      
      let scale = Math.min(maxFitW / cropW, maxFitH / cropH);
      if (scale > 3) scale = 3;
      
      const drawW = cropW * scale;
      const drawH = cropH * scale;
      
      const dx = (canvas.width - drawW) / 2;
      const dy = (canvas.height - drawH) / 2;
      
      try {
        ctx.drawImage(
          img,
          xStart, yStart, cropW, cropH,
          dx, dy, drawW, drawH
        );
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      } catch (err) {
        console.error("Canvas drawImage error:", err);
        resolve(imageSrc);
      }
    };
    img.onerror = () => {
      resolve(imageSrc);
    };
  });
};

const getCleanEcomImage = (category: string, name: string): string => {
  const nameLower = (name || '').toLowerCase();
  
  if (category === 'Jeans') {
    if (nameLower.includes('clara') || nameLower.includes('light') || nameLower.includes('clear')) {
      return 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400&fit=crop';
    }
    if (nameLower.includes('preta') || nameLower.includes('black') || nameLower.includes('escura') || nameLower.includes('dark')) {
      return 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=400&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400&fit=crop';
  }
  
  if (category === 'Jaqueta') {
    if (nameLower.includes('couro') || nameLower.includes('preta') || nameLower.includes('leather')) {
      return 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&fit=crop';
    }
    if (nameLower.includes('jeans') || nameLower.includes('denim')) {
      return 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=400&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&fit=crop';
  }
  
  if (category === 'Camiseta') {
    if (nameLower.includes('preta') || nameLower.includes('black') || nameLower.includes('escura')) {
      return 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=400&fit=crop';
    }
    if (nameLower.includes('branca') || nameLower.includes('white') || nameLower.includes('clara')) {
      return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&fit=crop';
    }
    if (nameLower.includes('cinza') || nameLower.includes('gray') || nameLower.includes('grey')) {
      return 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=400&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&fit=crop';
  }
  
  if (category === 'Sapato') {
    if (nameLower.includes('preto') || nameLower.includes('black') || nameLower.includes('samba') || nameLower.includes('escuro')) {
      return 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400&fit=crop';
    }
    if (nameLower.includes('branco') || nameLower.includes('white') || nameLower.includes('sapatilha') || nameLower.includes('claro')) {
      return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400&fit=crop';
    }
    if (nameLower.includes('bota') || nameLower.includes('boot') || nameLower.includes('marrom')) {
      return 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=400&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400&fit=crop';
  }
  
  if (category === 'Acessório') {
    if (nameLower.includes('óculos') || nameLower.includes('sunglasses') || nameLower.includes('retro') || nameLower.includes('oculos')) {
      return 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&fit=crop';
    }
    if (nameLower.includes('bolsa') || nameLower.includes('bag') || nameLower.includes('carteira')) {
      return 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&fit=crop';
    }
    if (nameLower.includes('boné') || nameLower.includes('cap') || nameLower.includes('chapéu') || nameLower.includes('bone')) {
      return 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=400&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&fit=crop';
  }
  
  if (nameLower.includes('moletom') || nameLower.includes('hoodie') || nameLower.includes('suéter') || nameLower.includes('sueter') || nameLower.includes('casaco')) {
    if (nameLower.includes('preto') || nameLower.includes('black') || nameLower.includes('escuro')) {
      return 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=400&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=400&fit=crop';
  }
  if (nameLower.includes('vestido') || nameLower.includes('dress')) {
    return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&fit=crop';
  }
  if (nameLower.includes('saia') || nameLower.includes('skirt')) {
    return 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=400&fit=crop';
  }
  
  return 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=400&fit=crop';
};

const getCountryFromLocation = (loc: string): string => {
  if (!loc) return 'Brasil';
  const lower = loc.toLowerCase().trim();
  if (lower.includes('brasil') || lower.includes('brazil') || lower.endsWith('br')) return 'Brasil';
  if (lower.includes('united states') || lower.includes('usa') || lower.includes('us') || lower.endsWith('us')) return 'EUA';
  if (lower.includes('united kingdom') || lower.includes('uk') || lower.includes('inglaterra') || lower.includes('reino unido') || lower.endsWith('uk')) return 'Reino Unido';
  if (lower.includes('france') || lower.includes('frança') || lower.endsWith('fr')) return 'França';
  if (lower.includes('italy') || lower.includes('itália') || lower.endsWith('it')) return 'Itália';
  if (lower.includes('portugal') || lower.endsWith('pt')) return 'Portugal';
  if (lower.includes('spain') || lower.includes('espanha') || lower.endsWith('es')) return 'Espanha';
  if (lower.includes('argentina') || lower.endsWith('ar')) return 'Argentina';
  
  const parts = loc.split(',');
  if (parts.length > 1) {
    return parts[parts.length - 1].trim();
  }
  return loc;
};

const COUNTRIES_LIST = [
  { name: 'Brasil', emoji: '🇧🇷' },
  { name: 'EUA', emoji: '🇺🇸' },
  { name: 'França', emoji: '🇫🇷' },
  { name: 'Itália', emoji: '🇮🇹' },
  { name: 'Portugal', emoji: '🇵🇹' },
  { name: 'Reino Unido', emoji: '🇬🇧' },
  { name: 'Espanha', emoji: '🇪🇸' },
  { name: 'Argentina', emoji: '🇦🇷' },
  { name: 'Todos', emoji: '🌐' }
];

interface AppSimulatorProps {
  onBackToWeb: () => void;
}

export default function AppSimulator({ onBackToWeb }: AppSimulatorProps) {
  // --- STATE ---
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [likingLooks, setLikingLooks] = useState<Record<string, boolean>>({});
  const [leaderboardCountry, setLeaderboardCountry] = useState<string>('Brasil');
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const [looks, setLooks] = useState<Look[]>([]);
  const [closet, setCloset] = useState<ClosetItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'explore' | 'add' | 'notifications' | 'profile'>('feed');
  const [feedSubTab, setFeedSubTab] = useState<'recent' | 'aura' | 'following'>('recent');

  // Real-time Weather Forecast state with precise default mock values mirroring the screenshot
  const [weatherForecast, setWeatherForecast] = useState<Record<number, { icon: string; tempMax: number; tempMin: number }>>({
    17: { icon: 'sun', tempMax: 24, tempMin: 12 },
    18: { icon: 'sun', tempMax: 24, tempMin: 13 },
    19: { icon: 'sun', tempMax: 26, tempMin: 15 },
    20: { icon: 'cloud', tempMax: 26, tempMin: 16 },
    21: { icon: 'sun', tempMax: 28, tempMin: 17 },
    22: { icon: 'cloud', tempMax: 29, tempMin: 19 },
    23: { icon: 'cloud', tempMax: 29, tempMin: 17 },
    24: { icon: 'cloud', tempMax: 29, tempMin: 17 },
    25: { icon: 'rain', tempMax: 21, tempMin: 16 },
    26: { icon: 'cloud', tempMax: 26, tempMin: 16 },
    27: { icon: 'cloud', tempMax: 30, tempMin: 17 },
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        let lat = -23.5505; // São Paulo by default
        let lon = -46.6333;
        
        if (profile && profile.location) {
          const locLower = profile.location.toLowerCase();
          if (locLower.includes('porto alegre')) {
            lat = -30.0346; lon = -51.2177;
          } else if (locLower.includes('rio de janeiro')) {
            lat = -22.9068; lon = -43.1729;
          } else if (locLower.includes('belo horizonte')) {
            lat = -19.9191; lon = -43.9378;
          } else if (locLower.includes('brasília') || locLower.includes('brasilia')) {
            lat = -15.7801; lon = -47.9292;
          } else if (locLower.includes('salvador')) {
            lat = -12.9714; lon = -38.5014;
          } else if (locLower.includes('curitiba')) {
            lat = -25.4290; lon = -49.2671;
          } else if (locLower.includes('fortaleza')) {
            lat = -3.7319; lon = -38.5267;
          }
        }
        
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.daily && data.daily.time) {
            const updatedForecast = { ...weatherForecast };
            data.daily.time.forEach((timeStr: string, idx: number) => {
              const parts = timeStr.split('-');
              const dayNum = parseInt(parts[2], 10);
              
              const max = Math.round(data.daily.temperature_2m_max[idx]);
              const min = Math.round(data.daily.temperature_2m_min[idx]);
              const code = data.daily.weathercode[idx];
              
              let icon = 'sun';
              if (code === 0) icon = 'sun';
              else if (code >= 1 && code <= 3) icon = 'sun-cloud'; // partly cloudy
              else if (code >= 45 && code <= 65) icon = 'cloud';
              else if (code >= 80 && code <= 95) icon = 'rain';
              
              updatedForecast[dayNum] = { icon, tempMax: max, tempMin: min };
            });
            setWeatherForecast(updatedForecast);
          }
        }
      } catch (err) {
        console.warn("Could not load real-time weather from Open-Meteo, using fallback default values:", err);
      }
    };
    fetchWeather();
  }, [profile?.location]);
  
  // Detail views
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);
  
  // Interactive 3D View states
  const [viewMode3D, setViewMode3D] = useState<boolean>(false);
  const [rotationY, setRotationY] = useState<number>(0);
  const [isDragging3D, setIsDragging3D] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  
  // Checkout & Interactive Purchase State
  const [checkoutItem, setCheckoutItem] = useState<ClosetItem | TaggedItem | null>(null);
  const [checkoutSeller, setCheckoutSeller] = useState<string>('');
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  
  // New Look Form
  const [lookImage, setLookImage] = useState('');
  const [lookTitle, setLookTitle] = useState('');
  const [lookDesc, setLookDesc] = useState('');
  const [lookLocation, setLookLocation] = useState('Porto Alegre, Brazil');
  const [lookAesthetics, setLookAesthetics] = useState<string[]>(['Acubi']);
  const [lookTags, setLookTags] = useState<TaggedItem[]>([]);
  const [isTagging, setIsTagging] = useState(false);
  const [tempTagX, setTempTagX] = useState(0);
  const [tempTagY, setTempTagY] = useState(0);
  
  // Temp Tag Form
  const [tagName, setTagName] = useState('');
  const [tagBrand, setTagBrand] = useState('');
  const [tagPrice, setTagPrice] = useState('199');
  const [tagForSale, setTagForSale] = useState(true);
  const [tagCategory, setTagCategory] = useState<'Jeans' | 'Jaqueta' | 'Camiseta' | 'Sapato' | 'Acessório' | 'Outros'>('Camiseta');

  // New Closet Item Form
  const [isAddingClosetItem, setIsAddingClosetItem] = useState(false);
  const [closetItemName, setClosetItemName] = useState('');
  const [closetItemCategory, setClosetItemCategory] = useState<'Jeans' | 'Jaqueta' | 'Camiseta' | 'Sapato' | 'Acessório' | 'Outros'>('Jeans');
  const [closetItemBrand, setClosetItemBrand] = useState('');
  const [closetItemPrice, setClosetItemPrice] = useState('150');
  const [closetItemForSale, setClosetItemForSale] = useState(true);
  const [closetItemImage, setClosetItemImage] = useState('');

  // Camera capture state
  const [isCapturingCamera, setIsCapturingCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const [isAnalyzingLook, setIsAnalyzingLook] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [aiAnalysisError, setAiAnalysisError] = useState('');

  const handleAiAnalyzeLook = async () => {
    if (!lookImage) return;
    setIsAnalyzingLook(true);
    setAiAnalysisError('');

    try {
      const response = await fetch('/api/gemini/analyze-look', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageBase64: lookImage })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Falha ao analisar o look.');
      }

      const data = await response.json();
      if (data.items && Array.isArray(data.items)) {
        const detectedTags: TaggedItem[] = [];

        for (let i = 0; i < data.items.length; i++) {
          const item = data.items[i];
          
          let croppedUrl = '';
          try {
            croppedUrl = await cropImagePiece(lookImage, item.box);
          } catch (cropErr) {
            console.error("Erro ao recortar peça " + item.name + ":", cropErr);
            croppedUrl = lookImage; // Fallback
          }

          detectedTags.push({
            id: 'tag_ai_' + i + '_' + Date.now(),
            name: item.name,
            brand: item.brand || 'Cloz',
            price: parseFloat(item.price) || 150,
            forSale: true,
            category: item.category as any,
            x: Math.round(item.x_center),
            y: Math.round(item.y_center),
            croppedImage: croppedUrl
          });
        }

        setLookTags(detectedTags);
        
        if (!lookTitle && detectedTags.length > 0) {
          const mainCategories = Array.from(new Set(detectedTags.map(t => t.category))).join(' & ');
          setLookTitle(`Outfit com ${mainCategories}`);
        }
        if (!lookDesc) {
          const itemsList = detectedTags.map(t => `${t.name} (${t.brand})`).join(', ');
          setLookDesc(`Look inteligente contendo: ${itemsList}.`);
        }
      }
    } catch (err: any) {
      console.error("Erro na análise por IA:", err);
      setAiAnalysisError(err.message || 'Ocorreu um erro ao processar com IA.');
    } finally {
      setIsAnalyzingLook(false);
    }
  };

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeletingLook, setIsDeletingLook] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // New settings high-fidelity navigation and toggles state
  const [settingsScreen, setSettingsScreen] = useState<string | null>(null);
  const [criarPecas, setCriarPecas] = useState(true);
  const [isProfilePrivate, setIsProfilePrivate] = useState(false);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [notifAuraTrends, setNotifAuraTrends] = useState(true);
  const [notifDailyOOTD, setNotifDailyOOTD] = useState(true);
  const [notifLikes, setNotifLikes] = useState(true);
  const [notifAppreciations, setNotifAppreciations] = useState(true);
  const [notifNotes, setNotifNotes] = useState(false);
  const [notifCommentLikes, setNotifCommentLikes] = useState(true);
  const [notifNewFollowers, setNotifNewFollowers] = useState(true);
  const [notifAcceptedRequests, setNotifAcceptedRequests] = useState(true);

  // Language state: defaults to Português
  const [language, setLanguage] = useState<string>('Português');

  // Edit Profile States
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [profileEditError, setProfileEditError] = useState('');

  // Synchronize Edit Profile states with current profile
  useEffect(() => {
    if (profile) {
      setEditName(profile.name || 'Rick');
      setEditUsername(profile.username || 'rickzinxx');
      setEditBio(profile.bio || '');
      setEditLocation(profile.location || 'São Paulo, Brazil');
      setEditInstagram(profile.instagram || 'rickzinxx_');
      setProfileEditError('');
    }
  }, [profile, settingsScreen]);

  // High fidelity language translations mapping
  const TRANSLATIONS: Record<string, Record<string, string>> = {
    pt: {
      settings: 'Configurações',
      editProfile: 'Editar Conta',
      save: 'Salvar',
      cancel: 'Cancelar',
      name: 'Nome',
      username: 'Usuário',
      about: 'Sobre',
      location: 'Localização',
      instagram: 'Instagram',
      placeholderAbout: 'Conte sobre você',
      deleteAccount: 'Excluir Conta',
      privacy: 'Privacidade',
      blockedUsers: 'Usuários Bloqueados',
      notifications: 'Notificações',
      language: 'Idioma',
      community: 'Comunidade',
      playStore: 'Play Store',
      updateApp: 'Atualizar app',
      systemDefault: 'Padrão do sistema',
      noBlockedUsers: 'Nenhum usuário bloqueado',
      allowNotifications: 'Permitir Notificações',
      allowNotificationsSub: 'Ativar ou desativar todas as notificações push',
      preferences: 'PREFERÊNCIAS',
      account: 'CONTA',
      aboutSection: 'SOBRE',
      affinities: 'AFINIDADES',
      posts: 'Postagens',
      followingFollowers: 'Seguindo e Seguidores',
      auraTrends: 'Aura e Tendências',
      dailyOOTD: 'Lembretes Diários de OOTD',
      likes: 'Curtidas',
      deepAppreciations: 'Apreciações Profundas',
      notes: 'Notas',
      notesSub: 'Ativo com Deep Appreciates ligado',
      likesOnComments: 'Curtidas em comentários',
      newFollowers: 'Novos Seguidores',
      acceptedRequests: 'Solicitações Aceitas',
      firstSteps: 'PRIMEIROS PASSOS',
      postLooks: 'Poste 3 looks',
      inviteFriend: 'Convide um amigo',
      addProfilePhoto: 'Adicione uma foto de perfil',
      createPieces: 'Criar peças a partir de looks',
      createPiecesSub: 'Se notarmos algo novo no seu look, adicionaremos ao seu closet',
      anonymizedImage: 'Esta imagem foi anonimizada por privacidade.',
      privateOpt: 'Privada',
      privateOptSub: 'Apenas seguidores aprovados podem ver seu perfil e coleções.',
      publicOpt: 'Pública',
      publicOptSub: 'Qualquer pessoa pode ver seu perfil e coleções.',
      recent: 'Recente',
      aura: 'Aura',
      following: 'Seguindo',
      explore: 'Explorar',
      postLook: 'Postar Look',
      profile: 'Perfil',
      feed: 'Feed',
      closet: 'Armário',
      looks: 'Looks',
      calendar: 'Calendário',
      followers: 'Seguidores',
      outfits: 'Composições',
      totalAura: 'Aura Total',
      invite: 'Convidar',
      edit: 'Editar',
      logout: 'Sair',
      wardrobeUsage: 'Uso do Guarda-Roupa',
      wardrobeUsageSub: 'Sua agenda de estilo está sincronizada em tempo real com a previsão de São Paulo. Use sugestões de IA baseadas nas condições climáticas do dia!'
    },
    en: {
      settings: 'Settings',
      editProfile: 'Edit Account',
      save: 'Save',
      cancel: 'Cancel',
      name: 'Name',
      username: 'Username',
      about: 'About',
      location: 'Location',
      instagram: 'Instagram',
      placeholderAbout: 'Tell us about yourself',
      deleteAccount: 'Delete Account',
      privacy: 'Privacy',
      blockedUsers: 'Blocked Users',
      notifications: 'Notifications',
      language: 'Language',
      community: 'Community',
      playStore: 'Play Store',
      updateApp: 'Update App',
      systemDefault: 'System default',
      noBlockedUsers: 'No blocked users',
      allowNotifications: 'Allow Notifications',
      allowNotificationsSub: 'Turn all push notifications on or off',
      preferences: 'PREFERENCES',
      account: 'ACCOUNT',
      aboutSection: 'ABOUT',
      affinities: 'AFFINITIES',
      posts: 'Posts',
      followingFollowers: 'Following and Followers',
      auraTrends: 'Aura and Trends',
      dailyOOTD: 'Daily OOTD Reminders',
      likes: 'Likes',
      deepAppreciations: 'Deep Appreciations',
      notes: 'Notes',
      notesSub: 'Active with Deep Appreciates turned on',
      likesOnComments: 'Likes on comments',
      newFollowers: 'New Followers',
      acceptedRequests: 'Accepted Requests',
      firstSteps: 'FIRST STEPS',
      postLooks: 'Post 3 looks',
      inviteFriend: 'Invite a friend',
      addProfilePhoto: 'Add a profile photo',
      createPieces: 'Create pieces from looks',
      createPiecesSub: 'If we notice anything new in your look, we will add it to your closet',
      anonymizedImage: 'This image has been anonymized for privacy.',
      privateOpt: 'Private',
      privateOptSub: 'Only approved followers can see your profile and collections.',
      publicOpt: 'Public',
      publicOptSub: 'Anyone can see your profile and collections.',
      recent: 'Recent',
      aura: 'Aura',
      following: 'Following',
      explore: 'Explore',
      postLook: 'Post Look',
      profile: 'Profile',
      feed: 'Feed',
      closet: 'Closet',
      looks: 'Looks',
      calendar: 'Calendar',
      followers: 'Followers',
      outfits: 'Outfits',
      totalAura: 'Total Aura',
      invite: 'Invite',
      edit: 'Edit',
      logout: 'Logout',
      wardrobeUsage: 'Wardrobe Usage',
      wardrobeUsageSub: 'Your style schedule is synced in real-time with the São Paulo weather forecast. Use AI suggestions based on daily weather conditions!'
    },
    es: {
      settings: 'Configuración',
      editProfile: 'Editar Cuenta',
      save: 'Guardar',
      cancel: 'Cancelar',
      name: 'Nombre',
      username: 'Usuario',
      about: 'Sobre mí',
      location: 'Ubicación',
      instagram: 'Instagram',
      placeholderAbout: 'Cuéntanos sobre ti',
      deleteAccount: 'Eliminar Cuenta',
      privacy: 'Privacidad',
      blockedUsers: 'Usuarios Bloqueados',
      notifications: 'Notificaciones',
      language: 'Idioma',
      community: 'Comunidad',
      playStore: 'Play Store',
      updateApp: 'Actualizar app',
      systemDefault: 'Predeterminado del sistema',
      noBlockedUsers: 'Ningún usuario bloqueado',
      allowNotifications: 'Permitir Notificaciones',
      allowNotificationsSub: 'Activar o desactivar todas las notificaciones push',
      preferences: 'PREFERENCIAS',
      account: 'CUENTA',
      aboutSection: 'SOBRE',
      affinities: 'AFINIDADES',
      posts: 'Publicaciones',
      followingFollowers: 'Siguiendo y Seguidores',
      auraTrends: 'Aura y Tendencias',
      dailyOOTD: 'Recordatorios Diarios de OOTD',
      likes: 'Me gusta',
      deepAppreciations: 'Apreciaciones Profundas',
      notes: 'Notas',
      notesSub: 'Activo con Apreciaciones Profundas activado',
      likesOnComments: 'Me gusta en comentarios',
      newFollowers: 'Nuevos Seguidores',
      acceptedRequests: 'Solicitudes Aceptadas',
      firstSteps: 'PRIMEROS PASOS',
      postLooks: 'Publica 3 looks',
      inviteFriend: 'Invita a un amigo',
      addProfilePhoto: 'Añade una foto de perfil',
      createPieces: 'Crear piezas a partir de looks',
      createPiecesSub: 'Si notamos algo nuevo en tu look, lo añadiremos a tu armario',
      anonymizedImage: 'Esta imagen ha sido anonimizada por privacidad.',
      privateOpt: 'Privada',
      privateOptSub: 'Solo los seguidores aprobados pueden ver tu perfil y colecciones.',
      publicOpt: 'Pública',
      publicOptSub: 'Cuyalquier persona puede ver tu perfil y colecciones.',
      recent: 'Reciente',
      aura: 'Aura',
      following: 'Siguiendo',
      explore: 'Explorar',
      postLook: 'Publicar Look',
      profile: 'Perfil',
      feed: 'Feed',
      closet: 'Armario',
      looks: 'Looks',
      calendar: 'Calendario',
      followers: 'Seguidores',
      outfits: 'Composiciones',
      totalAura: 'Aura Total',
      invite: 'Invitar',
      edit: 'Editar',
      logout: 'Salir',
      wardrobeUsage: 'Uso del Guardarropa',
      wardrobeUsageSub: '¡Tu agenda de estilo está sincronizada en tiempo real con el pronóstico del tiempo de São Paulo. Usa sugerencias de IA basadas en las condiciones climáticas del día!'
    },
    fr: {
      settings: 'Paramètres',
      editProfile: 'Modifier le Compte',
      save: 'Enregistrer',
      cancel: 'Annuler',
      name: 'Nom',
      username: "Nom d'utilisateur",
      about: 'À propos',
      location: 'Localisation',
      instagram: 'Instagram',
      placeholderAbout: 'Dites-en plus sur vous',
      deleteAccount: 'Supprimer le Compte',
      privacy: 'Confidentialité',
      blockedUsers: 'Utilisateurs Bloqués',
      notifications: 'Notifications',
      language: 'Langue',
      community: 'Communauté',
      playStore: 'Play Store',
      updateApp: "Mettre à jour l'app",
      systemDefault: 'Par défaut du système',
      noBlockedUsers: 'Aucun utilisateur bloqué',
      allowNotifications: 'Autoriser les Notifications',
      allowNotificationsSub: 'Activer ou désactiver toutes les notifications push',
      preferences: 'PRÉFÉRENCES',
      account: 'COMPTE',
      aboutSection: 'À PROPOS',
      affinities: 'AFFINITÉS',
      posts: 'Publications',
      followingFollowers: 'Abonnements et Abonnés',
      auraTrends: 'Aura et Tendances',
      dailyOOTD: 'Rappels Quotidiens OOTD',
      likes: "J'aime",
      deepAppreciations: 'Appréciations Profondes',
      notes: 'Notes',
      notesSub: 'Actif avec Appréciations Profondes activé',
      likesOnComments: "J'aime sur les commentaires",
      newFollowers: 'Nouveaux Abonnés',
      acceptedRequests: 'Demandes Acceptées',
      firstSteps: 'PREMIÈRES ÉTAPES',
      postLooks: 'Publier 3 looks',
      inviteFriend: 'Inviter un ami',
      addProfilePhoto: 'Ajouter une photo de profil',
      createPieces: 'Créer des pièces à partir de looks',
      createPiecesSub: "Si nous remarquons du nouveau dans votre look, nous l'ajouterons à votre garde-robe",
      anonymizedImage: 'Cette image a été anonymisée pour des raisons de confidentialité.',
      privateOpt: 'Privé',
      privateOptSub: 'Seuls les abonnés approuvés peuvent voir votre profil et vos collections.',
      publicOpt: 'Public',
      publicOptSub: 'Tout le monde peut voir votre profil et vos collections.',
      recent: 'Récent',
      aura: 'Aura',
      following: 'Abonnements',
      explore: 'Explorer',
      postLook: 'Publier Look',
      profile: 'Profil',
      feed: "Fil d'actualité",
      closet: 'Dressing',
      looks: 'Looks',
      calendar: 'Calendrier',
      followers: 'Abonnés',
      outfits: 'Tenues',
      totalAura: 'Aura Totale',
      invite: 'Inviter',
      edit: 'Modifier',
      logout: 'Déconnexion',
      wardrobeUsage: 'Utilisation de la Garde-robe',
      wardrobeUsageSub: "Votre calendrier de style est synchronisé en temps réel avec les prévisions météo de São Paulo. Utilisez les suggestions de l'IA selon la météo du jour !"
    },
    de: {
      settings: 'Einstellungen',
      editProfile: 'Konto bearbeiten',
      save: 'Speichern',
      cancel: 'Abbrechen',
      name: 'Name',
      username: 'Benutzername',
      about: 'Über mich',
      location: 'Standort',
      instagram: 'Instagram',
      placeholderAbout: 'Erzähle uns etwas über dich',
      deleteAccount: 'Konto löschen',
      privacy: 'Privatsphäre',
      blockedUsers: 'Blockierte Benutzer',
      notifications: 'Benachrichtigungen',
      language: 'Sprache',
      community: 'Gemeinschaft',
      playStore: 'Play Store',
      updateApp: 'App aktualisieren',
      systemDefault: 'Systemstandard',
      noBlockedUsers: 'Keine blockierten Benutzer',
      allowNotifications: 'Benachrichtigungen erlauben',
      allowNotificationsSub: 'Alle Push-Benachrichtigungen ein- oder ausschalten',
      preferences: 'EINSTELLUNGEN',
      account: 'KONTO',
      aboutSection: 'ÜBER',
      affinities: 'AFFINITÄTEN',
      posts: 'Beiträge',
      followingFollowers: 'Folge ich & Follower',
      auraTrends: 'Aura und Trends',
      dailyOOTD: 'Tägliche OOTD-Erinnerungen',
      likes: 'Gefällt mir',
      deepAppreciations: 'Tiefgehende Wertschätzungen',
      notes: 'Notizen',
      notesSub: 'Aktiv mit tiefgehenden Wertschätzungen aktiviert',
      likesOnComments: 'Likes für Kommentare',
      newFollowers: 'Neue Follower',
      acceptedRequests: 'Akzeptierte Anfragen',
      firstSteps: 'ERSTE SCHRITTE',
      postLooks: 'Poste 3 Looks',
      inviteFriend: 'Einen Freund einladen',
      addProfilePhoto: 'Profilbild hinzufügen',
      createPieces: 'Teile aus Looks erstellen',
      createPiecesSub: 'Wenn uns etwas Neues an Ihrem Look auffällt, fügen wir es Ihrem Kleiderschrank hinzu',
      anonymizedImage: 'Dieses Bild wurde aus Datenschutzgründen anonymisiert.',
      privateOpt: 'Privat',
      privateOptSub: 'Nur bestätigte Follower können Ihr Profil und Ihre Kollektionen sehen.',
      publicOpt: 'Öffentlich',
      publicOptSub: 'Jeder kann Ihr Profil und Ihre Kollektionen sehen.',
      recent: 'Aktuell',
      aura: 'Aura',
      following: 'Folge ich',
      explore: 'Entdecken',
      postLook: 'Look posten',
      profile: 'Profil',
      feed: 'Feed',
      closet: 'Kleiderschrank',
      looks: 'Looks',
      calendar: 'Kalender',
      followers: 'Follower',
      outfits: 'Outfits',
      totalAura: 'Gesamt-Aura',
      invite: 'Einladen',
      edit: 'Bearbeiten',
      logout: 'Abmelden',
      wardrobeUsage: 'Nutzung des Kleiderschranks',
      wardrobeUsageSub: 'Ihr Stilkalender wird in Echtzeit mit der Wettervorhersage für São Paulo synchronisiert. Nutzen Sie KI-Vorschläge basierend auf den täglichen Wetterbedingungen!'
    },
    zh_CN: {
      settings: '设置',
      editProfile: '编辑账户',
      save: '保存',
      cancel: '取消',
      name: '姓名',
      username: '用户名',
      about: '关于我',
      location: '位置',
      instagram: 'Instagram',
      placeholderAbout: '介绍一下你自己',
      deleteAccount: '注销账户',
      privacy: '隐私设置',
      blockedUsers: '黑名单',
      notifications: '通知',
      language: '语言',
      community: '社区',
      playStore: '应用商店',
      updateApp: '更新应用',
      systemDefault: '系统默认',
      noBlockedUsers: '暂无黑名单用户',
      allowNotifications: '允许通知',
      allowNotificationsSub: '开启或关闭所有推送通知',
      preferences: '偏好设置',
      account: '账户',
      aboutSection: '关于',
      affinities: '互动',
      posts: '帖子',
      followingFollowers: '关注与粉丝',
      auraTrends: '气场与趋势',
      dailyOOTD: '每日穿搭提醒',
      likes: '点赞',
      deepAppreciations: '深度赞赏',
      notes: '笔记',
      notesSub: '已开启深度赞赏',
      likesOnComments: '评论点赞',
      newFollowers: '新增粉丝',
      acceptedRequests: '接受的请求',
      firstSteps: '新手任务',
      postLooks: '发布3个穿搭',
      inviteFriend: '邀请好友',
      addProfilePhoto: '上传头像',
      createPieces: '自动生成单品',
      createPiecesSub: '如果我们在您的穿搭中发现新单品，将自动添加到衣橱',
      anonymizedImage: '出于隐私原因，此图片已做脱敏处理。',
      privateOpt: '私密账户',
      privateOptSub: '只有获批准的粉丝才能看到您的个人主页和收藏。',
      publicOpt: '公开账户',
      publicOptSub: '任何人都可以看到您的个人主页和收藏。',
      recent: '最新',
      aura: '气场',
      following: '关注中',
      explore: '探索',
      postLook: '发布穿搭',
      profile: '个人中心',
      feed: '动态',
      closet: '衣橱',
      looks: '穿搭',
      calendar: '日历',
      followers: '粉丝',
      outfits: '搭配数',
      totalAura: '总气场值',
      invite: '邀请',
      edit: '编辑',
      logout: '退出登录',
      wardrobeUsage: '衣橱使用率',
      wardrobeUsageSub: '您的每日穿搭日程与圣保罗天气预报实时同步。快来根据当天的天气使用AI穿搭建议吧！'
    },
    ja: {
      settings: '設定',
      editProfile: 'アカウント編集',
      save: '保存',
      cancel: 'キャンセル',
      name: '名前',
      username: 'ユーザー名',
      about: '自己紹介',
      location: 'ロケーション',
      instagram: 'Instagram',
      placeholderAbout: '自己紹介を書いてみましょう',
      deleteAccount: 'アカウントを削除',
      privacy: 'プライバシー',
      blockedUsers: 'ブロック中のユーザー',
      notifications: '通知',
      language: '言語',
      community: 'コミュニティ',
      playStore: 'Play ストア',
      updateApp: 'アプリを更新',
      systemDefault: 'システムデフォルト',
      noBlockedUsers: 'ブロックしているユーザーはいません',
      allowNotifications: '通知を許可する',
      allowNotificationsSub: 'すべてのプッシュ通知のオン/オフ',
      preferences: '設定',
      account: 'アカウント',
      aboutSection: '情報',
      affinities: 'アクティビティ',
      posts: '投稿',
      followingFollowers: 'フォローとフォロワー',
      auraTrends: 'オーラとトレンド',
      dailyOOTD: '毎日のOOTDリマインダー',
      likes: 'いいね',
      deepAppreciations: 'ディープ・アプレシエーション',
      notes: 'ノート',
      notesSub: 'ディープ・アプレシエーション有効時にアクティブ',
      likesOnComments: 'コメントへのいいね',
      newFollowers: '新しいフォロワー',
      acceptedRequests: '承認されたリクエスト',
      firstSteps: 'スタートガイド',
      postLooks: '3つのルックを投稿する',
      inviteFriend: '友達を招待する',
      addProfilePhoto: 'プロフィール写真を追加',
      createPieces: 'ルックからアイテムを作成',
      createPiecesSub: 'ルックに新しいアイテムが検出されると、自動的にクローゼットに追加されます',
      anonymizedImage: 'この画像はプライバシー保護のため匿名化されています。',
      privateOpt: '非公開',
      privateOptSub: '承認されたフォロワーのみがあなたのプロフィールとコレクションを閲覧できます。',
      publicOpt: '公開',
      publicOptSub: '誰でもあなたのプロフィールとコレクションを閲覧できます。',
      recent: '最近',
      aura: 'オーラ',
      following: 'フォロー中',
      explore: '見つける',
      postLook: 'ルックを投稿',
      profile: 'プロフィール',
      feed: 'フィード',
      closet: 'クローゼット',
      looks: 'ルック',
      calendar: 'カレンダー',
      followers: 'フォロワー',
      outfits: 'コーディネート',
      totalAura: 'トータルオーラ',
      invite: '招待する',
      edit: '編集',
      logout: 'ログアウト',
      wardrobeUsage: 'クローゼット活用状況',
      wardrobeUsageSub: 'コーディネートスケジュールは、サンパウロの天気予報とリアルタイムに同期しています。その日の天気に合わせたAIのおすすめを活用しましょう！'
    }
  };

  const t = (key: string) => {
    let langCode = 'pt';
    if (language === 'English') langCode = 'en';
    else if (language === 'Español') langCode = 'es';
    else if (language === 'Français') langCode = 'fr';
    else if (language === 'Deutsch') langCode = 'de';
    else if (language === '简体中文') langCode = 'zh_CN';
    else if (language === '繁體中文') langCode = 'zh_CN';
    else if (language === '日本語') langCode = 'ja';
    
    const langDict = TRANSLATIONS[langCode] || TRANSLATIONS['pt'];
    return langDict[key] || TRANSLATIONS['pt'][key] || key;
  };

  const [isConfirmingDeleteCloset, setIsConfirmingDeleteCloset] = useState(false);
  const [isDeletingCloset, setIsDeletingCloset] = useState(false);

  const handleDeleteLook = async (lookId: string) => {
    if (!profile) return;
    setIsDeletingLook(true);
    try {
      await deleteDoc(doc(db, 'looks', lookId));
      setSelectedLook(null);
      setIsConfirmingDelete(false);
    } catch (err) {
      console.error("Error deleting look:", err);
      alert("Erro ao excluir o post.");
    } finally {
      setIsDeletingLook(false);
    }
  };

  const handleDeleteClosetItem = async (itemId: string) => {
    if (!profile) return;
    setIsDeletingCloset(true);
    try {
      await deleteDoc(doc(db, 'closet', itemId));
      setSelectedItem(null);
      setIsConfirmingDeleteCloset(false);
    } catch (err) {
      console.error("Error deleting closet item:", err);
      alert("Erro ao excluir a peça do armário.");
    } finally {
      setIsDeletingCloset(false);
    }
  };

  useEffect(() => {
    setIsConfirmingDelete(false);
  }, [selectedLook]);

  useEffect(() => {
    setIsConfirmingDeleteCloset(false);
    setViewMode3D(false);
    setRotationY(0);
  }, [selectedItem]);

  useEffect(() => {
    if (viewMode3D && !isDragging3D) {
      const interval = setInterval(() => {
        setRotationY(prev => (prev + 0.6) % 360);
      }, 16);
      return () => clearInterval(interval);
    }
  }, [viewMode3D, isDragging3D]);

  const startCamera = async (mode: 'user' | 'environment' = 'user') => {
    setCameraError('');
    setIsCapturingCamera(true);
    
    // Stop any existing stream
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1080 }, height: { ideal: 1440 } },
        audio: false
      });
      setCameraStream(stream);
      setFacingMode(mode);
    } catch (err: any) {
      console.error("Erro ao acessar a câmera:", err);
      setCameraError('Permissão para câmera negada ou dispositivo indisponível.');
      setIsCapturingCamera(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCapturingCamera(false);
  };

  const capturePhoto = () => {
    if (!cameraStream) return;
    const videoElement = document.getElementById('camera-preview-video') as HTMLVideoElement;
    if (!videoElement) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth || 600;
      canvas.height = videoElement.videoHeight || 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setLookImage(dataUrl);
        stopCamera();
      }
    } catch (err) {
      console.error("Erro ao capturar foto:", err);
      setCameraError('Erro ao capturar imagem.');
    }
  };

  // Stop camera on tab change
  useEffect(() => {
    if (activeTab !== 'add' && isCapturingCamera) {
      stopCamera();
    }
  }, [activeTab]);

  // Bind video stream to ref
  useEffect(() => {
    if (videoRef.current) {
      if (cameraStream) {
        videoRef.current.srcObject = cameraStream;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [cameraStream]);

  // Search in Explore
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreFilter, setExploreFilter] = useState<'esteticas' | 'marcas' | 'cidades' | 'pessoas'>('esteticas');

  // Profile Tab
  const [profileSubTab, setProfileSubTab] = useState<'calendar' | 'camera' | 'closet'>('calendar');

  // Comments state
  const [newCommentText, setNewCommentText] = useState('');
  const [lookDetailTab, setLookDetailTab] = useState<'analytics' | 'pieces'>('analytics');

  const handleFollowUser = async (targetUserId: string) => {
    if (!profile) return;
    if (targetUserId === profile.uid) return;

    try {
      const selfRef = doc(db, 'users', profile.uid);
      const targetRef = doc(db, 'users', targetUserId);

      const targetSnap = await getDoc(targetRef);
      if (!targetSnap.exists()) return;
      const targetData = targetSnap.data() as UserProfile;

      const currentFollowing = Array.isArray(profile.following) ? profile.following : [];
      const currentTargetFollowers = Array.isArray(targetData.followers) ? targetData.followers : [];

      const isFollowing = currentFollowing.includes(targetUserId);

      let newFollowing = [...currentFollowing];
      let newTargetFollowers = [...currentTargetFollowers];
      let auraChange = 0;

      if (isFollowing) {
        // Unfollow
        newFollowing = newFollowing.filter(uid => uid !== targetUserId);
        newTargetFollowers = newTargetFollowers.filter(uid => uid !== profile.uid);
        auraChange = -10;
      } else {
        // Follow
        newFollowing.push(targetUserId);
        newTargetFollowers.push(profile.uid);
        auraChange = 10;
      }

      newFollowing = Array.from(new Set(newFollowing));
      newTargetFollowers = Array.from(new Set(newTargetFollowers));

      // Update self profile
      await updateDoc(selfRef, {
        following: newFollowing,
        followingCount: newFollowing.length
      });

      // Update target profile
      await updateDoc(targetRef, {
        followers: newTargetFollowers,
        followersCount: newTargetFollowers.length,
        auraScore: Math.max(0, (targetData.auraScore || 0) + auraChange)
      });

      // Send follower notification if following (and not unfollowing)
      if (!isFollowing) {
        const notifId = 'notif_follow_' + Date.now();
        const newNotif = {
          id: notifId,
          type: 'follow',
          fromUser: { username: profile.username, avatar: profile.avatar },
          title: profile.username,
          subtitle: 'começou a seguir você',
          auraAdded: 10,
          timestamp: 'Agora mesmo',
          targetUserId: targetUserId
        };
        await setDoc(doc(db, 'notifications', notifId), newNotif);
      }
    } catch (err) {
      console.error("Error following user:", err);
    }
  };



  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("SignOut error bypassed:", err);
    }
    localStorage.removeItem('cloz_profile');
    localStorage.removeItem('cloz_user');
    setProfile(null);
    setCurrentUser(null);
  };

  // Listen to Auth state and load real-time Firestore data
  useEffect(() => {
    // Check local storage session first (high-reliability fallback for Sandbox iFrames)
    const storedProfileStr = localStorage.getItem('cloz_profile');
    if (storedProfileStr) {
      try {
        const storedProfile = JSON.parse(storedProfileStr);
        setProfile(storedProfile);
        setCurrentUser({ uid: storedProfile.uid, email: storedProfile.email });
        setAuthLoading(false);
        console.log("Loaded persistent session from local storage:", storedProfile.username);
      } catch (err) {
        console.error("Failed to parse stored profile:", err);
      }
    }

    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Load or create user profile
        const profileRef = doc(db, 'users', user.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (!profileSnap.exists()) {
          // Create a new default profile if it doesn't exist
          const defaultProfile: UserProfile = {
            uid: user.uid,
            username: (user.email?.split('@')[0] || 'user_' + user.uid.substring(0, 5)),
            displayName: (user.email?.split('@')[0] || 'User'),
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
            bio: 'Visual Curator.',
            location: 'Brasil',
            followersCount: 0,
            followingCount: 0,
            auraScore: 0,
            totalOutfits: 0,
            following: [],
            followers: []
          };
          await setDoc(profileRef, defaultProfile);
        }

        // Set up real-time listener for current user profile
        unsubscribeProfile = onSnapshot(profileRef, (snap) => {
          if (snap.exists()) {
            const profData = snap.data() as UserProfile;
            const sanitized = {
              ...profData,
              following: profData.following || [],
              followers: profData.followers || [],
              followersCount: profData.followersCount ?? 0,
              followingCount: profData.followingCount ?? 0
            };
            setProfile(sanitized);
            localStorage.setItem('cloz_profile', JSON.stringify(sanitized));
          }
        });
        
      } else {
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }
        setCurrentUser(null);
        setProfile(null);
      }
      setAuthLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  // Sync collections in real-time once user is logged in
  useEffect(() => {
    if (!currentUser) return;

    // 1. Listen to looks collection (ordered by date)
    const looksQuery = query(collection(db, 'looks'), orderBy('date', 'desc'));
    const unsubscribeLooks = onSnapshot(looksQuery, (snapshot) => {
      const loadedLooks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Look[];
      setLooks(loadedLooks);
    }, (error) => {
      console.error("Firestore looks query failed.", error);
    });

    // 2. Listen to closet collection (all items)
    const closetQuery = query(collection(db, 'closet'));
    const unsubscribeCloset = onSnapshot(closetQuery, (snapshot) => {
      const loadedCloset = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ClosetItem[];
      setCloset(loadedCloset);
    }, (error) => {
      console.error("Firestore closet query failed.", error);
    });

    // 3. Listen to notifications (filter targeted to current user or generated by them)
    const notifsQuery = query(collection(db, 'notifications'));
    const unsubscribeNotifs = onSnapshot(notifsQuery, (snapshot) => {
      const loadedNotifs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((n: any) => !n.targetUserId || n.targetUserId === currentUser.uid) as AppNotification[];
      setNotifications(loadedNotifs.sort((a, b) => b.id.localeCompare(a.id)));
    }, (error) => {
      console.error("Firestore notifications query failed.", error);
    });

    // 4. Listen to users collection for leaderboard
    const usersQuery = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const loadedUsers = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as UserProfile[];
      // Filter out only mock test prefix
      const filteredUsers = loadedUsers.filter(u => !u.uid.startsWith('mock_'));
      setAllUsers(filteredUsers);
    }, (error) => {
      console.error("Firestore users query failed.", error);
    });

    return () => {
      unsubscribeLooks();
      unsubscribeCloset();
      unsubscribeNotifs();
      unsubscribeUsers();
    };
  }, [currentUser]);

  // Sync selectedLook with the latest data from looks collection in real-time
  useEffect(() => {
    if (selectedLook) {
      const updated = looks.find(l => l.id === selectedLook.id);
      if (updated) {
        setSelectedLook(updated);
      }
    }
  }, [looks]);

  // Sync leaderboard default country to profile country when profile loads
  useEffect(() => {
    if (profile && profile.location) {
      const userCountry = getCountryFromLocation(profile.location);
      setLeaderboardCountry(userCountry);
    }
  }, [profile]);

  // --- ACTIONS ---

  // Liking/Aura score
  const handleLikeLook = async (lookId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!profile) return;
    if (likingLooks[lookId]) return;

    setLikingLooks(prev => ({ ...prev, [lookId]: true }));

    try {
      const lookRef = doc(db, 'looks', lookId);
      const lookSnap = await getDoc(lookRef);
      if (!lookSnap.exists()) return;

      const lookData = lookSnap.data() as Look;
      const currentLikedBy = Array.isArray(lookData.likedBy) ? lookData.likedBy : [];
      const isLiked = currentLikedBy.includes(profile.uid);
      
      let newLikedBy = [...currentLikedBy];
      let auraDiff = 0;

      if (isLiked) {
        newLikedBy = newLikedBy.filter(id => id !== profile.uid);
        auraDiff = -1;
      } else {
        newLikedBy.push(profile.uid);
        auraDiff = 1;
      }

      // Deduplicate to guarantee a user can never be in the array multiple times
      newLikedBy = Array.from(new Set(newLikedBy));
      const newLikesCount = newLikedBy.length;

      // Update look document
      await updateDoc(lookRef, {
        likes: newLikesCount,
        likedBy: newLikedBy,
        auraScore: Math.max(0, (lookData.auraScore || 0) + auraDiff)
      });

      // If the look belongs to another user, update their aura score
      if (lookData.userId !== profile.uid) {
        const authorRef = doc(db, 'users', lookData.userId);
        const authorSnap = await getDoc(authorRef);
        if (authorSnap.exists()) {
          const authorData = authorSnap.data() as UserProfile;
          await updateDoc(authorRef, {
            auraScore: Math.max(0, (authorData.auraScore || 0) + auraDiff)
          });
        }

        if (auraDiff > 0) {
          // Send notification to owner
          const notifId = 'notif_' + Date.now();
          const newNotif: AppNotification = {
            id: notifId,
            type: 'like',
            fromUser: { username: profile.username, avatar: profile.avatar },
            title: profile.username,
            subtitle: 'curtiu sua composição!',
            lookImage: lookData.image,
            auraAdded: 1,
            timestamp: 'Agora mesmo'
          };
          await setDoc(doc(db, 'notifications', notifId), {
            ...newNotif,
            targetUserId: lookData.userId
          });
        }
      } else {
        // Own look liked, update own active profile
        const selfRef = doc(db, 'users', profile.uid);
        await updateDoc(selfRef, {
          auraScore: Math.max(0, (profile.auraScore || 0) + auraDiff)
        });
        setProfile(prev => prev ? { ...prev, auraScore: Math.max(0, prev.auraScore + auraDiff) } : null);
      }
    } catch (err) {
      console.error("Error liking look:", err);
    } finally {
      setLikingLooks(prev => ({ ...prev, [lookId]: false }));
    }
  };

  // Tag creation
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTempTagX(x);
    setTempTagY(y);
    setIsTagging(true);
  };

  const handleAddTag = () => {
    if (!tagName) return;
    const newTag: TaggedItem = {
      id: 'tag_' + Date.now(),
      name: tagName,
      brand: tagBrand || 'Cloz',
      price: parseFloat(tagPrice) || 0,
      forSale: tagForSale,
      category: tagCategory,
      x: Math.round(tempTagX),
      y: Math.round(tempTagY)
    };
    setLookTags([...lookTags, newTag]);
    setTagName('');
    setTagBrand('');
    setTagPrice('150');
    setIsTagging(false);
  };

  // Look creation
  const handleCreateLook = async () => {
    if (!lookImage || !profile) return;
    setIsAnalyzingLook(true);
    setAiAnalysisError('');
    
    let finalTags: TaggedItem[] = [...lookTags];
    let finalTitle = lookTitle;
    let finalDesc = lookDesc;
    
    try {
      // 1. If user hasn't analyzed/tagged yet, run the full automatic Vision AI pipeline
      if (finalTags.length === 0) {
        setAnalysisStep('Analisando o visual com Visão Computacional...');
        
        const response = await fetch('/api/gemini/analyze-look', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ imageBase64: lookImage })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Falha ao analisar o look.');
        }

        const data = await response.json();
        if (data.items && Array.isArray(data.items)) {
          setAnalysisStep('Identificando peças de roupa e calçados...');
          
          for (let i = 0; i < data.items.length; i++) {
            const item = data.items[i];
            
            setAnalysisStep(`Separando e recortando: ${item.name}...`);
            
            let croppedUrl = '';
            try {
              croppedUrl = await cropImagePiece(lookImage, item.box);
            } catch (cropErr) {
              console.error("Erro ao recortar peça " + item.name + ":", cropErr);
              croppedUrl = lookImage; // Fallback
            }

            // Fetch a clean, professional, internet-like flat-lay image corresponding to the category
            const identicalCleanUrl = getCleanEcomImage(item.category, item.name);

            finalTags.push({
              id: 'tag_ai_' + i + '_' + Date.now(),
              name: item.name,
              brand: item.brand || 'Cloz',
              price: parseFloat(item.price) || 150,
              forSale: true,
              category: item.category as any,
              x: Math.round(item.x_center),
              y: Math.round(item.y_center),
              croppedImage: croppedUrl,
              cleanEcomImage: identicalCleanUrl // store clean ecom identical image representation
            });
          }
          
          if (!finalTitle && finalTags.length > 0) {
            const mainCategories = Array.from(new Set(finalTags.map(t => t.category))).join(' & ');
            finalTitle = `Outfit com ${mainCategories}`;
          }
          if (!finalDesc) {
            const itemsList = finalTags.map(t => `${t.name} (${t.brand})`).join(', ');
            finalDesc = `Look inteligente contendo: ${itemsList}.`;
          }
        }
      } else {
        // If the user has some manual tags, let's map them to clean internet e-commerce images as well!
        setAnalysisStep('Processando suas tags...');
        for (let i = 0; i < finalTags.length; i++) {
          const tag = finalTags[i];
          if (!tag.croppedImage) {
            tag.croppedImage = lookImage;
          }
          tag.cleanEcomImage = getCleanEcomImage(tag.category, tag.name);
        }
      }

      setAnalysisStep('Salvando composição...');
      
      const lookId = 'look_' + Date.now();
      const newLook: Look = {
        id: lookId,
        userId: profile.uid,
        username: profile.username,
        userAvatar: profile.avatar,
        image: lookImage,
        title: finalTitle || 'Registro de Outfit',
        description: finalDesc || 'Minha nova composição do dia.',
        tags: finalTags,
        likes: 0,
        likedBy: [],
        views: 1,
        auraScore: 0,
        date: new Date().toISOString().split('T')[0],
        commentsCount: 0,
        location: lookLocation,
        aesthetics: lookAesthetics
      };

      // Save look in Firestore
      await setDoc(doc(db, 'looks', lookId), {
        ...newLook,
        comments: []
      });

      setAnalysisStep('Adicionando peças ao seu armário digital...');

      // Add each tagged item to the closet in Firestore
      for (const tag of finalTags) {
        const itemId = 'closet_' + tag.id;
        
        // Use the pristine, internet-sourced identical clean image as the main closet item image,
        // and store the cropped fragment from the outfit photo.
        const cleanImg = tag.cleanEcomImage || tag.croppedImage || lookImage;
        
        const newItem: ClosetItem = {
          id: itemId,
          userId: profile.uid,
          name: tag.name,
          category: tag.category,
          brand: tag.brand,
          price: tag.price,
          image: cleanImg, // Pristine, solid-background identical e-commerce garment image
          croppedImage: tag.croppedImage, // Original cropped fragment
          forSale: tag.forSale,
          boughtAt: new Date().toISOString().split('T')[0],
          timesWorn: 1,
          costPerWear: tag.price
        };
        await setDoc(doc(db, 'closet', itemId), newItem);
      }

      setAnalysisStep('Finalizado com sucesso!');
      
      // Reset Form
      setLookTitle('');
      setLookDesc('');
      setLookTags([]);
      setLookImage('');
      setActiveTab('profile');
      setProfileSubTab('closet'); // Go straight to the closet to see the new items!
    } catch (err: any) {
      console.error("Erro na publicação automática por IA:", err);
      setAiAnalysisError(err.message || 'Ocorreu um erro ao publicar e analisar com IA.');
    } finally {
      setIsAnalyzingLook(false);
      setAnalysisStep('');
    }
  };

  // Add individual closet item
  const handleAddClosetItem = async () => {
    if (!closetItemName || !profile) return;
    const itemId = 'closet_' + Date.now();
    const newItem: ClosetItem = {
      id: itemId,
      userId: profile.uid,
      name: closetItemName,
      category: closetItemCategory,
      brand: closetItemBrand || 'Outros',
      price: parseFloat(closetItemPrice) || 0,
      image: closetItemImage,
      forSale: closetItemForSale,
      boughtAt: new Date().toISOString().split('T')[0],
      timesWorn: 1,
      costPerWear: parseFloat(closetItemPrice) || 0
    };

    await setDoc(doc(db, 'closet', itemId), newItem);
    setIsAddingClosetItem(false);
    setClosetItemName('');
    setClosetItemBrand('');
  };

  // Simulate Item/Tag purchase
  const handlePurchase = async () => {
    if (!checkoutItem || !buyerName || !buyerPhone || !profile) return;

    const notifId = 'notif_sale_' + Date.now();
    const newNotif = {
      id: notifId,
      type: 'sale',
      fromUser: { username: buyerName, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
      title: 'Proposta de Compra!',
      subtitle: `${buyerName} quer comprar ${checkoutItem.name} de ${checkoutSeller} por R$ ${checkoutItem.price}. WhatsApp: ${buyerPhone}`,
      timestamp: 'Agora mesmo',
      targetUserId: checkoutItem.userId // recipient of the purchase offer
    };

    await setDoc(doc(db, 'notifications', notifId), newNotif);
    setCheckoutSuccess(true);

    setTimeout(() => {
      setCheckoutSuccess(false);
      setCheckoutItem(null);
      setBuyerName('');
      setBuyerPhone('');
    }, 4000);
  };

  // Comments handler
  const handleAddComment = async () => {
    if (!newCommentText.trim() || !profile || !selectedLook) return;

    const newComment = {
      id: 'comment_' + Date.now(),
      username: profile.username,
      avatar: profile.avatar,
      text: newCommentText.trim(),
      timestamp: 'Agora mesmo'
    };

    const lookRef = doc(db, 'looks', selectedLook.id);
    const existingComments = (selectedLook as any).comments || [];
    const updatedComments = [...existingComments, newComment];

    await updateDoc(lookRef, {
      comments: updatedComments,
      commentsCount: updatedComments.length
    });

    if (selectedLook.userId !== profile.uid) {
      const notifId = 'notif_comm_' + Date.now();
      const newNotif: AppNotification = {
        id: notifId,
        type: 'comment',
        fromUser: { username: profile.username, avatar: profile.avatar },
        title: profile.username,
        subtitle: `comentou: "${newCommentText.substring(0, 30)}${newCommentText.length > 30 ? '...' : ''}"`,
        lookImage: selectedLook.image,
        timestamp: 'Agora mesmo'
      };
      await setDoc(doc(db, 'notifications', notifId), {
        ...newNotif,
        targetUserId: selectedLook.userId
      });
    }

    const updatedLook = {
      ...selectedLook,
      comments: updatedComments,
      commentsCount: updatedComments.length
    };
    setSelectedLook(updatedLook);
    setNewCommentText('');
  };


  // Filtering feeds
  const filteredLooks = looks.filter(look => {
    if (activeTab === 'explore' && searchQuery) {
      const query = searchQuery.toLowerCase();
      if (exploreFilter === 'esteticas') {
        return look.aesthetics.some(ae => ae.toLowerCase().includes(query));
      } else if (exploreFilter === 'marcas') {
        return look.tags.some(tag => tag.brand.toLowerCase().includes(query));
      } else if (exploreFilter === 'cidades') {
        return look.location.toLowerCase().includes(query);
      } else if (exploreFilter === 'pessoas') {
        return look.username.toLowerCase().includes(query);
      }
    }
    return true;
  });

  const getCalendarDays = () => {
    // Return mock calendar days for July 2026 (starting on Wednesday, 31 days)
    const days = [];
    // For a Monday-first calendar (Se, Te, Qu, Qu, Se, Sá, Do), Wednesday is the 3rd column,
    // so we need exactly 2 empty cells (Segunda and Terça).
    for (let i = 0; i < 2; i++) days.push({ day: null, hasLook: null });
    for (let d = 1; d <= 31; d++) {
      const dateStr = `2026-07-${d < 10 ? '0' + d : d}`;
      const dayLook = profile ? looks.find(l => l.userId === profile.uid && l.date === dateStr) : null;
      days.push({ day: d, hasLook: dayLook || null });
    }
    return days;
  };

  return (
    <div className="bg-[#FAF9F6] text-[#171717] min-h-screen font-sans flex flex-col">
      {/* Real Responsive Web Header */}
      {profile && (
        <header className="sticky top-0 bg-white/90 backdrop-blur z-40 border-b border-gray-200/50 flex items-center justify-between px-6 h-16 shadow-2xs">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => { setActiveTab('feed'); setSelectedLook(null); setSelectedItem(null); }}
              className="font-display font-extrabold text-xl tracking-tight hover:opacity-80 transition cursor-pointer"
            >
              Cloz
            </button>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold">
            <button 
              onClick={() => { setActiveTab('feed'); setSelectedLook(null); setSelectedItem(null); }}
              className={`hover:text-black transition cursor-pointer flex items-center space-x-1.5 ${activeTab === 'feed' ? 'text-black font-bold' : 'text-gray-400'}`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Feed</span>
            </button>
            <button 
              onClick={() => { setActiveTab('explore'); setSelectedLook(null); setSelectedItem(null); }}
              className={`hover:text-black transition cursor-pointer flex items-center space-x-1.5 ${activeTab === 'explore' ? 'text-black font-bold' : 'text-gray-400'}`}
            >
              <Grid className="w-4 h-4" />
              <span>Explorar</span>
            </button>
            <button 
              onClick={() => { setActiveTab('add'); setSelectedLook(null); setSelectedItem(null); }}
              className={`hover:text-black transition cursor-pointer flex items-center space-x-1.5 ${activeTab === 'add' ? 'text-black font-bold' : 'text-gray-400'}`}
            >
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">+</span>
              <span>Postar Look</span>
            </button>
            <button 
              onClick={() => { setActiveTab('notifications'); setSelectedLook(null); setSelectedItem(null); }}
              className={`hover:text-black transition cursor-pointer flex items-center space-x-1.5 relative ${activeTab === 'notifications' ? 'text-black font-bold' : 'text-gray-400'}`}
            >
              <Bell className="w-4 h-4" />
              <span>Notificações</span>
              {notifications.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] px-1 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => { setActiveTab('profile'); setSelectedLook(null); setSelectedItem(null); }}
              className={`hover:text-black transition cursor-pointer flex items-center space-x-1.5 ${activeTab === 'profile' ? 'text-black font-bold' : 'text-gray-400'}`}
            >
              <User className="w-4 h-4" />
              <span>Perfil</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-[#171717]/5 px-3 py-1.5 rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-gray-800">+{profile.auraScore} Aura</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-red-600 transition font-medium cursor-pointer flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Dynamic View Container */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
        
        {/* Dynamic Content Frame */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-200/50 p-6 shadow-2xs flex flex-col relative overflow-hidden">
          {authLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400 font-mono">Carregando Cloz...</p>
            </div>
          ) : !profile ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <AuthScreen onAuthSuccess={(prof) => {
                setProfile(prof);
                setCurrentUser(auth.currentUser || { uid: prof.uid, email: (prof as any).email || `${prof.username}@cloz.app` });
              }} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
            
            {/* 1. FEED VIEW */}
            {activeTab === 'feed' && (
              <div className="flex-1 flex flex-col animate-fadeIn">
                {/* Header and Feed Selector */}
                <div className="sticky top-0 bg-white/95 backdrop-blur z-20 pb-3 pt-2.5 border-b border-gray-100 flex items-center justify-between px-3">
                  {/* Minimalist circular logo from the screenshots */}
                  <div className="w-7 h-7 rounded-full border border-black/80 flex items-center justify-center shrink-0">
                    <div className="w-3.5 h-[1.5px] bg-black/80 rotate-45"></div>
                  </div>

                  {/* Central Navigation Tabs with bottom underline */}
                  <div className="flex items-center space-x-6 text-sm">
                    <button 
                      onClick={() => setFeedSubTab('recent')} 
                      className={`pb-1 relative transition-all cursor-pointer ${feedSubTab === 'recent' ? 'text-black font-extrabold' : 'text-gray-400 font-medium'}`}
                    >
                      <span>Recente</span>
                      {feedSubTab === 'recent' && (
                        <span className="absolute bottom-[-13px] inset-x-0 h-[2.5px] bg-black rounded-full"></span>
                      )}
                    </button>
                    <button 
                      onClick={() => setFeedSubTab('aura')} 
                      className={`pb-1 relative transition-all cursor-pointer ${feedSubTab === 'aura' ? 'text-black font-extrabold' : 'text-gray-400 font-medium'}`}
                    >
                      <span>Aura</span>
                      {feedSubTab === 'aura' && (
                        <span className="absolute bottom-[-13px] inset-x-0 h-[2.5px] bg-black rounded-full"></span>
                      )}
                    </button>
                    <button 
                      onClick={() => setFeedSubTab('following')} 
                      className={`pb-1 relative transition-all cursor-pointer ${feedSubTab === 'following' ? 'text-black font-extrabold' : 'text-gray-400 font-medium'}`}
                    >
                      <span>Seguindo</span>
                      {feedSubTab === 'following' && (
                        <span className="absolute bottom-[-13px] inset-x-0 h-[2.5px] bg-black rounded-full"></span>
                      )}
                    </button>
                  </div>

                  {/* Right Status (Aura points in a lightning bolt design) */}
                  <div className="flex items-center space-x-1 font-mono text-[11px] font-bold bg-[#171717]/5 px-2.5 py-1 rounded-full text-gray-800 shrink-0">
                    <Zap className="w-3.5 h-3.5 text-black fill-black" />
                    <span>{profile.auraScore}</span>
                  </div>
                </div>

                {/* Aura Announcement banner */}
                {feedSubTab === 'aura' ? (
                  <div className="m-3 bg-amber-50/30 p-3.5 rounded-2xl border border-amber-200/40 flex flex-col gap-1 text-left animate-fadeIn">
                    <div className="flex items-center space-x-1.5 text-[10px] font-mono text-amber-700 uppercase tracking-wider font-bold">
                      <span>🏆 RANKING DE AURA • {leaderboardCountry.toUpperCase()}</span>
                    </div>
                    <p className="text-[11px] text-gray-700 leading-snug">
                      Veja os maiores curadores de moda e criadores de tendência do país. Acumule curtidas e inspire a comunidade para subir no ranking!
                    </p>
                  </div>
                ) : null}

                {/* Filters Row */}
                {feedSubTab !== 'aura' && (
                  <div className="flex items-center justify-between px-3.5 py-1.5 text-[11px] font-bold text-gray-500 animate-fadeIn">
                    <button className="flex items-center space-x-1.5 bg-neutral-100/60 hover:bg-neutral-100 px-3 py-1.5 rounded-full border border-transparent hover:border-gray-200 transition cursor-pointer">
                      <span>🇧🇷</span>
                      <span>Brazil</span>
                      <span className="text-[8px] text-gray-400">↕</span>
                    </button>
                    <button className="flex items-center space-x-1.5 bg-neutral-100/60 hover:bg-neutral-100 px-3 py-1.5 rounded-full border border-transparent hover:border-gray-200 transition cursor-pointer">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                      <span>Todos os Andares</span>
                      <span className="text-[8px] text-gray-400">↕</span>
                    </button>
                  </div>
                )}

                {/* Looks Feed List */}
                <div className="space-y-4 px-3 pb-6">
                  {feedSubTab === 'aura' ? (
                    <div className="space-y-4 text-left animate-fadeIn">
                      {/* Country scrolling selector */}
                      <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {COUNTRIES_LIST.map(country => (
                          <button
                            key={country.name}
                            onClick={() => setLeaderboardCountry(country.name)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border shrink-0 flex items-center space-x-1 ${
                              leaderboardCountry === country.name
                                ? 'bg-black border-black text-white shadow-xs'
                                : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                            }`}
                          >
                            <span>{country.emoji}</span>
                            <span>{country.name}</span>
                          </button>
                        ))}
                      </div>

                      {/* Leaderboard List */}
                      <div className="bg-neutral-50/50 rounded-3xl p-2.5 border border-gray-100 space-y-2">
                        {(() => {
                          const filteredUsers = allUsers.filter(u => {
                            if (leaderboardCountry === 'Todos') return true;
                            return getCountryFromLocation(u.location) === leaderboardCountry;
                          });

                          const sortedLeaderboard = [...filteredUsers].sort((a, b) => (b.auraScore || 0) - (a.auraScore || 0));

                          if (sortedLeaderboard.length === 0) {
                            return (
                              <div className="py-8 text-center text-gray-400 text-xs">
                                Nenhum curador de moda neste país ainda.
                              </div>
                            );
                          }

                          return sortedLeaderboard.map((user, idx) => {
                            const isCurrentUser = profile && user.uid === profile.uid;
                            const rank = idx + 1;
                            
                            let rankBadge = (
                              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-neutral-200 text-neutral-700 text-[10px] font-mono font-bold shrink-0">
                                {rank}
                              </span>
                            );
                            if (rank === 1) {
                              rankBadge = (
                                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-100 border border-amber-300 text-amber-700 text-[10px] font-bold shrink-0">
                                  👑
                                </span>
                              );
                            } else if (rank === 2) {
                              rankBadge = (
                                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-bold shrink-0">
                                  🥈
                                </span>
                              );
                            } else if (rank === 3) {
                              rankBadge = (
                                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold shrink-0">
                                  🥉
                                </span>
                              );
                            }

                            return (
                              <div
                                key={user.uid}
                                className={`flex items-center justify-between p-2 rounded-2xl border transition-all ${
                                  isCurrentUser 
                                    ? 'bg-emerald-50/40 border-emerald-100 shadow-xs' 
                                    : 'bg-white border-gray-100 hover:border-gray-200'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  {rankBadge}
                                  <div className="relative shrink-0">
                                    <img 
                                      src={user.avatar} 
                                      className="w-8.5 h-8.5 rounded-full object-cover border border-gray-100" 
                                      alt="avatar" 
                                    />
                                    {isCurrentUser && (
                                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
                                    )}
                                  </div>
                                  <div className="text-left min-w-0">
                                    <div className="flex items-center space-x-1">
                                      <span className="text-xs font-bold text-gray-800 truncate block">
                                        {user.displayName}
                                      </span>
                                      <span className="text-[8px] font-mono font-bold text-gray-400 bg-neutral-100 px-1 py-0.2 rounded shrink-0">
                                        Lv.{Math.floor((user.auraScore || 0) / 10) + 1}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 block font-light truncate">
                                      @{user.username} • {user.location || 'Desconhecido'}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="text-xs font-bold font-mono text-emerald-600 block">
                                    +{user.auraScore || 0}
                                  </span>
                                  <span className="text-[8px] uppercase tracking-wider text-gray-400 block font-mono font-bold">
                                    Aura
                                  </span>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 pb-24 px-3 animate-fadeIn">
                      {(() => {
                        const filtered = looks.filter(look => {
                          if (feedSubTab === 'following') {
                            return profile.following && profile.following.includes(look.userId);
                          }
                          return true;
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="col-span-2 py-16 text-center text-gray-400 text-xs font-mono">
                              {feedSubTab === 'following' 
                                ? "Você ainda não segue ninguém com publicações." 
                                : "Nenhum look encontrado."}
                            </div>
                          );
                        }

                        return filtered.map(look => (
                          <div 
                            key={look.id} 
                            onClick={() => setSelectedLook(look)}
                            className="relative aspect-[2/3.3] rounded-3xl overflow-hidden cursor-pointer group bg-neutral-100 border border-gray-100 text-left animate-fadeIn shadow-2xs"
                          >
                            {/* Raw image - perfectly clean, no dots, prices or badges overlay */}
                            <img 
                              src={look.image} 
                              alt={look.title}
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" 
                            />

                            {/* Top-Right Likes Pill (same design as screenshots) */}
                            {look.likes > 0 && (
                              <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-white flex items-center space-x-1 z-10 shadow-sm">
                                <Heart className="w-2.5 h-2.5 fill-white text-white" stroke="none" />
                                <span>{look.likes}</span>
                              </div>
                            )}

                            {/* Bottom Gradient and Info Overlay Bar (avatar, username, heart) */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 pt-6 flex items-center justify-between z-10">
                              <div className="flex items-center space-x-1.5 min-w-0">
                                <img 
                                  src={look.userAvatar} 
                                  className="w-5.5 h-5.5 rounded-full object-cover border border-white/20 shrink-0" 
                                  alt={look.username} 
                                />
                                <span className="text-[10px] font-bold text-white truncate shadow-xs">
                                  @{look.username}
                                </span>
                              </div>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLikeLook(look.id);
                                }}
                                className="text-white hover:scale-110 active:scale-95 transition shrink-0 p-1"
                              >
                                <Heart 
                                  className={`w-3.5 h-3.5 ${
                                    profile && look.likedBy.includes(profile.uid) 
                                      ? 'fill-red-500 text-red-500 stroke-none' 
                                      : 'text-white'
                                  }`} 
                                />
                              </button>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. EXPLORE VIEW */}
            {activeTab === 'explore' && (
              <div className="flex-1 flex flex-col animate-fadeIn px-3 text-left">
                {/* Search Bar */}
                <div className="sticky top-0 bg-white/95 backdrop-blur z-20 py-3 space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Buscar estéticas, marcas ou peças..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-neutral-100 pl-9 pr-4 py-2 rounded-full text-xs outline-none focus:bg-neutral-200/50 border border-transparent focus:border-gray-200 transition"
                    />
                  </div>
                  
                  {/* Category Pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold">
                    {(['esteticas', 'marcas', 'cidades', 'pessoas'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setExploreFilter(f)}
                        className={`px-3.5 py-1.5 rounded-full capitalize shrink-0 transition-all ${exploreFilter === f ? 'bg-black text-white' : 'bg-neutral-100 text-gray-500'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter Results or Static Aesthetics */}
                {searchQuery ? (
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Resultados da Busca ({filteredLooks.length})</span>
                    <div className="grid grid-cols-2 gap-2">
                      {filteredLooks.map(look => (
                        <div 
                          key={look.id} 
                          onClick={() => setSelectedLook(look)}
                          className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs group cursor-pointer"
                        >
                          <img src={look.image} className="w-full aspect-[4/5] object-cover" alt="look" />
                          <div className="p-2 text-left">
                            <span className="text-[10px] text-gray-400 font-mono">@{look.username}</span>
                            <p className="text-[10px] font-bold text-gray-800 truncate leading-none mt-0.5">{look.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2 pb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Aura Ontologias (Estéticas)</span>
                      <span className="text-[10px] text-gray-400">Ver todas</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {SEED_AESTHETICS.map(ae => (
                        <div 
                          key={ae.id}
                          onClick={() => setSearchQuery(ae.name)}
                          className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer border border-gray-100"
                        >
                          <img src={ae.image} className="absolute inset-0 w-full h-full object-cover brightness-[0.75]" alt={ae.name} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex flex-col justify-end text-left text-white">
                            <span className="text-xs font-bold tracking-tight">{ae.name}</span>
                            <span className="text-[9px] text-gray-300 font-mono mt-0.5">{ae.count} looks</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. ADD LOOK VIEW */}
            {activeTab === 'add' && (
              <div className="flex-1 flex flex-col animate-fadeIn px-4 py-3 text-left space-y-4 pb-12 relative">
                {isAnalyzingLook && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="relative flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full border-4 border-neutral-100 border-t-black animate-spin"></div>
                      <Sparkles className="w-5 h-5 text-amber-500 absolute animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-display font-extrabold text-sm text-gray-900 leading-none">Cloz Vision AI</p>
                      <p className="text-[11px] text-gray-600 font-medium mt-1 animate-pulse">{analysisStep || "Processando visual..."}</p>
                      <p className="text-[9px] text-gray-400 font-light max-w-[220px] mx-auto mt-2 leading-relaxed">
                        Buscando categorias e gerando peças idênticas na nuvem para o seu armário...
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="font-display font-extrabold text-sm text-gray-900">Novo Registro Diário</span>
                  <button 
                    onClick={handleCreateLook}
                    disabled={!lookImage || isAnalyzingLook}
                    className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-neutral-800 disabled:opacity-40 transition cursor-pointer"
                  >
                    Publicar
                  </button>
                </div>

                <div className="space-y-3.5">
                  {/* Outfit Photo (with click to tag) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Foto do Look (Toque na imagem carregada para adicionar tags de roupas)</label>
                    
                    {lookImage ? (
                      <div className="relative aspect-[3/4] bg-neutral-100 rounded-3xl overflow-hidden border border-gray-200/60 cursor-crosshair">
                        <img 
                          src={lookImage} 
                          alt="new look placeholder" 
                          onClick={handleImageClick}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Active tags on preview */}
                        {lookTags.map(tag => (
                          <div 
                            key={tag.id}
                            className="absolute bg-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-gray-300 shadow flex items-center space-x-1"
                            style={{ left: `${tag.x}%`, top: `${tag.y}%`, transform: 'translate(-50%, -50%)' }}
                          >
                            <span>{tag.name} (R$ {tag.price})</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setLookTags(lookTags.filter(t => t.id !== tag.id));
                              }} 
                              className="text-red-500 hover:text-red-700 ml-1 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        {/* Clear photo button */}
                        <button
                          type="button"
                          onClick={() => { setLookImage(''); setLookTags([]); }}
                          className="absolute top-3 right-3 bg-black/70 text-white rounded-full p-1.5 hover:bg-black transition z-30"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {/* Tag insertion popover */}
                        <AnimatePresence>
                          {isTagging && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gray-200 text-xs w-60 z-30 space-y-2.5 text-left"
                              style={{ left: `${Math.min(tempTagX, 40)}%`, top: `${Math.min(tempTagY, 50)}%` }}
                            >
                              <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                                <span className="font-bold text-gray-800">Tag de Roupa</span>
                                <button onClick={() => setIsTagging(false)} className="text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
                              </div>
                              <div className="space-y-1.5">
                                <input 
                                  type="text" 
                                  placeholder="Nome da peça (ex: Baggy Jeans)" 
                                  value={tagName}
                                  onChange={(e) => setTagName(e.target.value)}
                                  className="w-full bg-neutral-100/80 p-1.5 rounded text-[11px] outline-none"
                                />
                                <div className="grid grid-cols-2 gap-1.5">
                                  <input 
                                    type="text" 
                                    placeholder="Marca (ex: Zara)" 
                                    value={tagBrand}
                                    onChange={(e) => setTagBrand(e.target.value)}
                                    className="w-full bg-neutral-100/80 p-1.5 rounded text-[11px] outline-none"
                                  />
                                  <input 
                                    type="number" 
                                    placeholder="Preço (R$)" 
                                    value={tagPrice}
                                    onChange={(e) => setTagPrice(e.target.value)}
                                    className="w-full bg-neutral-100/80 p-1.5 rounded text-[11px] outline-none"
                                  />
                                </div>
                                <div className="flex items-center justify-between text-[11px] pt-1">
                                  <span className="text-gray-500 font-medium">À Venda?</span>
                                  <input 
                                    type="checkbox" 
                                    checked={tagForSale}
                                    onChange={(e) => setTagForSale(e.target.checked)}
                                    className="accent-neutral-900"
                                  />
                                </div>
                                <div className="text-[10px] space-y-1">
                                  <span className="text-gray-400 block font-mono">Categoria</span>
                                  <select 
                                    value={tagCategory} 
                                    onChange={(e) => setTagCategory(e.target.value as any)}
                                    className="w-full bg-neutral-100 p-1 rounded text-[10px]"
                                  >
                                    <option value="Jeans">Jeans / Calça</option>
                                    <option value="Jaqueta">Jaqueta / Casaco</option>
                                    <option value="Camiseta">Camiseta / Camisa</option>
                                    <option value="Sapato">Sapato / Tênis</option>
                                    <option value="Acessório">Acessório</option>
                                    <option value="Outros">Outros</option>
                                  </select>
                                </div>
                              </div>
                              <button 
                                onClick={handleAddTag}
                                className="w-full bg-black text-white py-1.5 rounded text-[11px] font-bold"
                              >
                                Salvar Tag
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* AI Automated Notice */}
                        <div className="absolute bottom-4 left-4 right-4 z-40 pointer-events-none flex justify-center">
                          <div className="bg-black/75 backdrop-blur-md text-white text-[9px] py-1.5 px-3 rounded-full font-bold flex items-center gap-1.5 shadow-lg border border-white/10">
                            <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
                            <span>Suas peças serão cortadas e salvas ao publicar! ✨</span>
                          </div>
                        </div>
                      </div>
                    ) : isCapturingCamera ? (
                      <div className="relative aspect-[3/4] bg-black rounded-3xl overflow-hidden border border-gray-200/60 flex items-center justify-center">
                        <video
                          id="camera-preview-video"
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                        />
                        
                        {/* Camera Info/Error overlay */}
                        {cameraError && (
                          <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-4 text-center z-40">
                            <div className="space-y-3">
                              <p className="text-xs text-red-400 font-semibold">{cameraError}</p>
                              <button 
                                type="button" 
                                onClick={stopCamera} 
                                className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold"
                              >
                                Voltar
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Top controls */}
                        {!cameraError && (
                          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-40">
                            <button
                              type="button"
                              onClick={() => startCamera(facingMode === 'user' ? 'environment' : 'user')}
                              className="bg-black/50 backdrop-blur-md text-white rounded-full p-2 hover:bg-black/70 transition cursor-pointer"
                              title="Alternar Câmera"
                            >
                              <Smartphone className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={stopCamera}
                              className="bg-black/50 backdrop-blur-md text-white rounded-full p-2 hover:bg-black/70 transition cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Bottom shutter control */}
                        {!cameraError && (
                          <div className="absolute bottom-6 inset-x-0 flex justify-center items-center z-40">
                            <button
                              type="button"
                              onClick={capturePhoto}
                              className="w-14 h-14 bg-white rounded-full border-4 border-white/30 flex items-center justify-center active:scale-95 transition hover:bg-neutral-100 cursor-pointer shadow-lg"
                            >
                              <div className="w-10 h-10 bg-white rounded-full border border-gray-300"></div>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center aspect-[3/4] bg-neutral-50 rounded-3xl border border-gray-200/60 p-6 text-center space-y-4">
                        <div className="p-3.5 bg-white rounded-full shadow-2xs border border-gray-100">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-gray-800 block">Adicionar Foto do Look</span>
                          <span className="text-[10px] text-gray-400 font-light block leading-relaxed max-w-[200px]">Escolha como deseja adicionar a foto do seu look real</span>
                        </div>
                        <div className="flex flex-col w-full gap-2 px-4">
                          <button
                            type="button"
                            onClick={() => startCamera('user')}
                            className="w-full bg-black text-white text-xs py-2.5 rounded-xl font-bold hover:bg-neutral-800 transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Camera className="w-4 h-4" />
                            Tirar Foto Agora
                          </button>
                          
                          <label
                            htmlFor="look-file-upload"
                            className="w-full bg-white border border-gray-200 text-gray-700 text-xs py-2.5 rounded-xl font-bold hover:bg-neutral-50 transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Grid className="w-4 h-4" />
                            Galeria do Celular
                          </label>
                          <input
                            id="look-file-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setLookImage(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Details */}
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Título da Composição</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Minimal Outfitting Outono" 
                        value={lookTitle}
                        onChange={(e) => setLookTitle(e.target.value)}
                        className="w-full bg-white border border-gray-200 p-2.5 rounded-xl text-xs outline-none focus:border-black transition"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Descrição / Notas de Estilo</label>
                      <textarea 
                        placeholder="Quais detalhes chamam atenção? O caimento, o tecido..." 
                        value={lookDesc}
                        onChange={(e) => setLookDesc(e.target.value)}
                        rows={2}
                        className="w-full bg-white border border-gray-200 p-2.5 rounded-xl text-xs outline-none focus:border-black transition resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Localização</label>
                        <input 
                          type="text" 
                          value={lookLocation}
                          onChange={(e) => setLookLocation(e.target.value)}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-xl text-xs outline-none focus:border-black transition"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Ontologia (Estética)</label>
                        <select 
                          value={lookAesthetics[0]}
                          onChange={(e) => setLookAesthetics([e.target.value])}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-xl text-xs outline-none focus:border-black transition"
                        >
                          {SEED_AESTHETICS.map(ae => (
                            <option key={ae.id} value={ae.name}>{ae.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. NOTIFICATIONS VIEW */}
            {activeTab === 'notifications' && (
              <div className="flex-1 flex flex-col animate-fadeIn text-left">
                <div className="sticky top-0 bg-white/95 backdrop-blur z-20 px-4 py-3 border-b border-gray-100">
                  <span className="font-display font-extrabold text-base tracking-tight">Notificações</span>
                </div>

                <div className="divide-y divide-gray-100 px-3">
                  {notifications.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 italic text-xs">
                      Nenhuma notificação por enquanto.
                    </div>
                  ) : (
                    notifications.map(notif => {
                      const senderUser = allUsers.find(u => u.username === notif.fromUser?.username);
                      const isAlreadyFollowing = senderUser && profile?.following && profile.following.includes(senderUser.uid);

                      return (
                        <div key={notif.id} className="py-3.5 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img src={notif.fromUser.avatar} className="w-9 h-9 rounded-full object-cover border border-neutral-100 shadow-3xs" alt="avatar" />
                            <div className="space-y-0.5">
                              <p className="text-xs text-gray-900 leading-tight">
                                <span className="font-bold">@{notif.fromUser.username}</span> {notif.subtitle}
                              </p>
                              <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-400">
                                <span>{notif.timestamp}</span>
                                {notif.auraAdded && (
                                  <span className="text-emerald-500 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">+{notif.auraAdded} Aura</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {notif.type === 'follow' && senderUser && (
                            <button
                              onClick={() => handleFollowUser(senderUser.uid)}
                              className={`ml-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold transition cursor-pointer shrink-0 shadow-3xs ${
                                isAlreadyFollowing
                                  ? 'bg-neutral-100 text-gray-400 border border-gray-200'
                                  : 'bg-[#1E3F20] text-white hover:bg-neutral-800'
                              }`}
                            >
                              {isAlreadyFollowing ? 'Seguindo' : 'Seguir de volta'}
                            </button>
                          )}

                          {notif.lookImage && (
                            <img src={notif.lookImage} className="w-10 h-10 rounded-xl object-cover border border-gray-100 shrink-0" alt="look" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* 5. PROFILE VIEW */}
            {activeTab === 'profile' && (
              <div className="flex-1 flex flex-col animate-fadeIn text-left bg-[#FAF9F6] h-full overflow-hidden">
                
                {/* --- 1. SETTINGS: MAIN SCREEN --- */}
                {settingsScreen === 'main' && (
                  <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] animate-fadeIn">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-20">
                      <button 
                        onClick={() => setSettingsScreen(null)} 
                        className="p-1.5 -ml-1 hover:bg-neutral-50 rounded-full transition cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-800" />
                      </button>
                      <span className="text-sm font-bold text-gray-900">{t('settings')}</span>
                      <div className="w-8"></div> {/* Spacer for symmetry */}
                    </div>

                    {/* Scrollable list */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                      {/* Card 1: User Edit Row */}
                      <div 
                        onClick={() => setSettingsScreen('edit_profile')}
                        className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-100 shadow-3xs cursor-pointer hover:bg-neutral-50/40 transition"
                      >
                        <div className="flex items-center space-x-3.5">
                          <img src={profile.avatar} className="w-11 h-11 rounded-full object-cover border border-neutral-100 shadow-3xs" alt="avatar" />
                          <div>
                            <p className="text-xs font-bold text-gray-800 leading-none">{profile.name || 'Rick'}</p>
                            <p className="text-[10px] text-gray-400 font-medium mt-1">{t('editProfile')}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>

                      {/* Card 2: Automatic Closet Pieces toggle */}
                      <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-100 shadow-3xs">
                        <div className="space-y-0.5 max-w-[75%] text-left">
                          <p className="text-xs font-bold text-gray-800">{t('createPieces')}</p>
                          <p className="text-[10px] text-gray-400 leading-normal">{t('createPiecesSub')}</p>
                        </div>
                        {/* Custom visual switch */}
                        <button
                          onClick={() => setCriarPecas(!criarPecas)}
                          className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${criarPecas ? 'bg-[#1E3F20]' : 'bg-neutral-200'}`}
                        >
                          <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${criarPecas ? 'translate-x-4.5' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {/* Card 3: Red border "PRIMEIROS PASSOS" exactly matching screenshot */}
                      <div className="border border-red-500/80 bg-red-50/15 rounded-2xl p-4 space-y-3.5">
                        <p className="text-[10px] font-bold text-red-600 tracking-wider font-mono">🔴 {t('firstSteps')} · 2/3</p>
                        
                        <div className="space-y-3">
                          {/* Row 1: Poste 3 looks (Completed) */}
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full bg-emerald-700 flex items-center justify-center shrink-0">
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-600 line-through decoration-gray-300">{t('postLooks')}</span>
                          </div>

                          <div className="border-b border-red-100/40" />

                          {/* Row 2: Convide um amigo (Pending clickable) */}
                          <div 
                            onClick={() => {
                              navigator.clipboard.writeText(`https://cloz.app/${profile.username}`);
                              alert("Link de convite copiado! Envie para seus amigos.");
                            }}
                            className="flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                              <span className="text-xs font-bold text-gray-800 group-hover:text-black transition">{t('inviteFriend')}</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          </div>

                          <div className="border-b border-red-100/40" />

                          {/* Row 3: Adicione uma foto de perfil (Completed) */}
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full bg-emerald-700 flex items-center justify-center shrink-0">
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-600 line-through decoration-gray-300">{t('addProfilePhoto')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section: CONTA */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase ml-1.5">{t('account')}</p>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-3xs overflow-hidden divide-y divide-gray-50">
                          {/* Row 1: Privacidade */}
                          <div 
                            onClick={() => setSettingsScreen('privacy')}
                            className="p-4 flex items-center justify-between hover:bg-neutral-50/50 cursor-pointer transition"
                          >
                            <div className="flex items-center space-x-3">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              <span className="text-xs font-semibold text-gray-700">{t('privacy')}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>

                          {/* Row 2: Usuários Bloqueados */}
                          <div 
                            onClick={() => setSettingsScreen('blocked')}
                            className="p-4 flex items-center justify-between hover:bg-neutral-50/50 cursor-pointer transition"
                          >
                            <div className="flex items-center space-x-3">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                              <span className="text-xs font-semibold text-gray-700">{t('blockedUsers')}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Section: PREFERÊNCIAS */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase ml-1.5">{t('preferences')}</p>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-3xs overflow-hidden divide-y divide-gray-50">
                          {/* Row 1: Notificações */}
                          <div 
                            onClick={() => setSettingsScreen('notifications')}
                            className="p-4 flex items-center justify-between hover:bg-neutral-50/50 cursor-pointer transition"
                          >
                            <div className="flex items-center space-x-3">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                              </svg>
                              <span className="text-xs font-semibold text-gray-700">{t('notifications')}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>

                          {/* Row 2: Idioma */}
                          <div 
                            onClick={() => setSettingsScreen('language')}
                            className="p-4 flex items-center justify-between hover:bg-neutral-50/50 cursor-pointer transition"
                          >
                            <div className="flex items-center space-x-3">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                              </svg>
                              <div className="text-left">
                                <span className="text-xs font-semibold text-gray-700 block">{t('language')}</span>
                                <span className="text-[9px] text-gray-400">{language}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Section: SOBRE */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase ml-1.5">{t('aboutSection')}</p>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-3xs overflow-hidden divide-y divide-gray-50">
                          {/* Row 1: Comunidade */}
                          <div 
                            onClick={() => alert("Entrando na Comunidade Cloz no Discord!")}
                            className="p-4 flex items-center justify-between hover:bg-neutral-50/50 cursor-pointer transition"
                          >
                            <div className="flex items-center space-x-3">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                              </svg>
                              <span className="text-xs font-semibold text-gray-700">{t('community')}</span>
                            </div>
                            <span className="text-xs text-gray-400">↗</span>
                          </div>

                          {/* Row 2: Play Store */}
                          <div 
                            onClick={() => alert("Link da Play Store!")}
                            className="p-4 flex items-center justify-between hover:bg-neutral-50/50 cursor-pointer transition"
                          >
                            <div className="flex items-center space-x-3">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs font-semibold text-gray-700">{t('playStore')}</span>
                            </div>
                            <span className="text-xs text-gray-400">↗</span>
                          </div>

                          {/* Row 3: Atualizar app */}
                          <div 
                            onClick={() => alert("Seu app já está na versão mais recente!")}
                            className="p-4 flex items-center justify-between hover:bg-neutral-50/50 cursor-pointer transition"
                          >
                            <div className="flex items-center space-x-3">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
                              </svg>
                              <span className="text-xs font-semibold text-gray-700">{t('updateApp')}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 2. SETTINGS: EDIT PROFILE SCREEN --- */}
                {settingsScreen === 'edit_profile' && (
                  <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] animate-fadeIn text-left">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-20">
                      <button 
                        onClick={() => setSettingsScreen('main')} 
                        className="text-xs font-semibold text-gray-500 hover:text-black transition"
                      >
                        {t('cancel')}
                      </button>
                      <span className="text-sm font-bold text-gray-900">{t('editProfile')}</span>
                      <button 
                        onClick={async () => {
                          if (!profile) return;
                          setProfileEditError('');
                          const cleanUsername = editUsername.toLowerCase().replace(/[^a-z0-9_.]/g, '');
                          if (cleanUsername.length < 3) {
                            setProfileEditError('O nome de usuário deve ter pelo menos 3 caracteres.');
                            return;
                          }

                          try {
                            if (cleanUsername !== profile.username) {
                              const uQuery = query(collection(db, 'users'), where('username', '==', cleanUsername));
                              const uSnapshot = await getDocs(uQuery);
                              if (!uSnapshot.empty) {
                                setProfileEditError('Este nome de usuário já está sendo usado por outra pessoa. Escolha outro.');
                                return;
                              }
                            }

                            const updated = {
                              ...profile,
                              name: editName,
                              username: cleanUsername,
                              bio: editBio,
                              location: editLocation,
                              instagram: editInstagram
                            };
                            await setDoc(doc(db, 'users', profile.uid), updated);
                            setProfile(updated);
                            setSettingsScreen('main');
                          } catch (err) {
                            console.error(err);
                            // Fallback local update
                            setProfile(prev => prev ? ({
                              ...prev,
                              name: editName,
                              username: cleanUsername,
                              bio: editBio,
                              location: editLocation,
                              instagram: editInstagram
                            }) : null);
                            setSettingsScreen('main');
                          }
                        }}
                        className="text-xs font-bold text-[#1E3F20]"
                      >
                        {t('save')}
                      </button>
                    </div>

                    {/* Form Scrollable */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-20 text-left">
                      {profileEditError && (
                        <div className="bg-red-50 text-red-600 text-[11px] p-3 rounded-2xl border border-red-100 mb-2">
                          {profileEditError}
                        </div>
                      )}
                      {/* Avatar Picker Mockup */}
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="relative cursor-pointer">
                          <img src={profile.avatar} className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md" alt="avatar" />
                          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-xs">
                            <Camera className="w-3.5 h-3.5 text-gray-600" />
                          </div>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 block">{t('name')}</label>
                        <input 
                          type="text" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-neutral-100/80 rounded-2xl py-3 px-4 text-xs text-gray-800 outline-none border border-transparent focus:border-neutral-200 transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 block">{t('username')}</label>
                        <input 
                          type="text" 
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="w-full bg-neutral-100/80 rounded-2xl py-3 px-4 text-xs text-gray-800 outline-none border border-transparent focus:border-neutral-200 transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 block">{t('about')}</label>
                        <textarea 
                          rows={3}
                          placeholder={t('placeholderAbout')}
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          className="w-full bg-neutral-100/80 rounded-2xl py-3 px-4 text-xs text-gray-800 outline-none border border-transparent focus:border-neutral-200 transition resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 block">{t('location')}</label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            value={editLocation}
                            onChange={(e) => setEditLocation(e.target.value)}
                            className="w-full bg-neutral-100/80 rounded-2xl py-3 pl-10 pr-10 text-xs text-gray-800 outline-none border border-transparent focus:border-neutral-200 transition"
                          />
                          {editLocation && (
                            <button 
                              onClick={() => setEditLocation('')}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 block">{t('instagram')}</label>
                        <input 
                          type="text" 
                          value={editInstagram}
                          onChange={(e) => setEditInstagram(e.target.value)}
                          className="w-full bg-neutral-100/80 rounded-2xl py-3 px-4 text-xs text-gray-800 outline-none border border-transparent focus:border-neutral-200 transition"
                        />
                      </div>

                      {/* Excluir Conta click */}
                      <div className="pt-4 flex justify-center">
                        <button 
                          type="button"
                          onClick={() => {
                            if (confirm("Tem certeza que deseja excluir sua conta permanentemente? Esta ação é irreversível.")) {
                              alert("Conta excluída ficticiamente.");
                            }
                          }}
                          className="text-xs font-bold text-red-500 hover:text-red-700 transition"
                        >
                          {t('deleteAccount')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 3. SETTINGS: PRIVACY SCREEN --- */}
                {settingsScreen === 'privacy' && (
                  <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] animate-fadeIn text-left">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-20">
                      <button 
                        onClick={() => setSettingsScreen('main')} 
                        className="p-1.5 -ml-1 hover:bg-neutral-50 rounded-full transition cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-800" />
                      </button>
                      <span className="text-sm font-bold text-gray-900">{t('privacy')}</span>
                      <button 
                        onClick={() => {
                          alert("Configurações de privacidade salvas!");
                          setSettingsScreen('main');
                        }}
                        className="text-xs font-bold text-[#1E3F20]"
                      >
                        {t('save')}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 space-y-5 text-left overflow-y-auto pb-20">
                      {/* Censored/Anonymized Image Block exactly like screenshots */}
                      <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-2xl shadow-3xs">
                        <div className="relative rounded-xl overflow-hidden aspect-[3/4] w-36 shadow-sm border border-neutral-100">
                          <img src={profile.avatar} className="w-full h-full object-cover" alt="anonymized" />
                          {/* Censorship Brush Stroke / Black Bar over eyes */}
                          <div className="absolute top-[35%] left-0 right-0 h-4 bg-black/95 transform rotate-2 shadow-xs flex items-center justify-center">
                            <span className="text-[7px] text-white tracking-widest font-mono uppercase font-bold">PRIVATE</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 italic text-center mt-3 leading-normal max-w-[200px]">
                          {t('anonymizedImage')}
                        </span>
                      </div>

                      {/* Options Radio List */}
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-3xs overflow-hidden divide-y divide-gray-50">
                        {/* Option 1: Privada */}
                        <div 
                          onClick={() => setIsProfilePrivate(true)}
                          className="p-4 flex items-start justify-between cursor-pointer hover:bg-neutral-50/50 transition"
                        >
                          <div className="space-y-1 text-left max-w-[80%]">
                            <p className="text-xs font-bold text-gray-800">{t('privateOpt')}</p>
                            <p className="text-[10px] text-gray-400 leading-normal">{t('privateOptSub')}</p>
                          </div>
                          {/* Radio circle */}
                          <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${isProfilePrivate ? 'border-[#1E3F20]' : 'border-gray-300'}`}>
                            {isProfilePrivate && <div className="w-2.2 h-2.2 rounded-full bg-[#1E3F20]" />}
                          </div>
                        </div>

                        {/* Option 2: Pública */}
                        <div 
                          onClick={() => setIsProfilePrivate(false)}
                          className="p-4 flex items-start justify-between cursor-pointer hover:bg-neutral-50/50 transition"
                        >
                          <div className="space-y-1 text-left max-w-[80%]">
                            <p className="text-xs font-bold text-gray-800">{t('publicOpt')}</p>
                            <p className="text-[10px] text-gray-400 leading-normal">{t('publicOptSub')}</p>
                          </div>
                          {/* Radio circle */}
                          <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${!isProfilePrivate ? 'border-[#1E3F20]' : 'border-gray-300'}`}>
                            {!isProfilePrivate && <div className="w-2.2 h-2.2 rounded-full bg-[#1E3F20]" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 4. SETTINGS: BLOCKED USERS SCREEN --- */}
                {settingsScreen === 'blocked' && (
                  <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] animate-fadeIn text-left">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-20">
                      <button 
                        onClick={() => setSettingsScreen('main')} 
                        className="p-1.5 -ml-1 hover:bg-neutral-50 rounded-full transition cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-800" />
                      </button>
                      <span className="text-sm font-bold text-gray-900">{t('blockedUsers')}</span>
                      <div className="w-8"></div>
                    </div>

                    {/* Centered Empty State */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                      <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <span className="text-xs font-medium">{t('noBlockedUsers')}</span>
                    </div>
                  </div>
                )}

                {/* --- 5. SETTINGS: NOTIFICATIONS MAIN --- */}
                {settingsScreen === 'notifications' && (
                  <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] animate-fadeIn text-left">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-20">
                      <button 
                        onClick={() => setSettingsScreen('main')} 
                        className="p-1.5 -ml-1 hover:bg-neutral-50 rounded-full transition cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-800" />
                      </button>
                      <span className="text-sm font-bold text-gray-900">{t('notifications')}</span>
                      <div className="w-8"></div>
                    </div>

                    {/* Scroll Area */}
                    <div className="flex-1 p-4 space-y-4 text-left overflow-y-auto pb-20">
                      {/* Master Push Toggle */}
                      <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-100 shadow-3xs">
                        <div className="space-y-0.5 max-w-[75%] text-left">
                          <p className="text-xs font-bold text-gray-800">{t('allowNotifications')}</p>
                          <p className="text-[10px] text-gray-400 leading-normal">{t('allowNotificationsSub')}</p>
                        </div>
                        {/* Custom Switch */}
                        <button
                          onClick={() => setAllowNotifications(!allowNotifications)}
                          className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${allowNotifications ? 'bg-[#1E3F20]' : 'bg-neutral-200'}`}
                        >
                          <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${allowNotifications ? 'translate-x-4.5' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {/* Section: AFINIDADES */}
                      <div className="space-y-1.5 opacity-90">
                        <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase ml-1.5">{t('affinities')}</p>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-3xs overflow-hidden divide-y divide-gray-50">
                          {/* Row 1: Postagens */}
                          <div 
                            onClick={() => setSettingsScreen('notifications_posts')}
                            className="p-4 flex items-center justify-between hover:bg-neutral-50/50 cursor-pointer transition"
                          >
                            <span className="text-xs font-semibold text-gray-700">{t('posts')}</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>

                          {/* Row 2: Seguindo e Seguidores */}
                          <div 
                            onClick={() => setSettingsScreen('notifications_follows')}
                            className="p-4 flex items-center justify-between hover:bg-neutral-50/50 cursor-pointer transition"
                          >
                            <span className="text-xs font-semibold text-gray-700">{t('followingFollowers')}</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>

                          {/* Row 3: Aura e Tendências */}
                          <div className="p-4 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700">{t('auraTrends')}</span>
                            <button
                              disabled={!allowNotifications}
                              onClick={() => setNotifAuraTrends(!notifAuraTrends)}
                              className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!allowNotifications ? 'opacity-40 cursor-not-allowed' : ''} ${notifAuraTrends && allowNotifications ? 'bg-[#1E3F20]' : 'bg-neutral-200'}`}
                            >
                              <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${notifAuraTrends && allowNotifications ? 'translate-x-4.5' : 'translate-x-0'}`} />
                            </button>
                          </div>

                          {/* Row 4: Lembretes Diários de OOTD */}
                          <div className="p-4 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700">{t('dailyOOTD')}</span>
                            <button
                              disabled={!allowNotifications}
                              onClick={() => setNotifDailyOOTD(!notifDailyOOTD)}
                              className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!allowNotifications ? 'opacity-40 cursor-not-allowed' : ''} ${notifDailyOOTD && allowNotifications ? 'bg-[#1E3F20]' : 'bg-neutral-200'}`}
                            >
                              <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${notifDailyOOTD && allowNotifications ? 'translate-x-4.5' : 'translate-x-0'}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 6. SETTINGS: NOTIFICATIONS POSTS --- */}
                {settingsScreen === 'notifications_posts' && (
                  <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] animate-fadeIn text-left">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-20">
                      <button 
                        onClick={() => setSettingsScreen('notifications')} 
                        className="p-1.5 -ml-1 hover:bg-neutral-50 rounded-full transition cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-800" />
                      </button>
                      <span className="text-sm font-bold text-gray-900">{t('posts')}</span>
                      <div className="w-8"></div>
                    </div>

                    {/* Options list */}
                    <div className="flex-1 p-4 space-y-4 text-left overflow-y-auto pb-20">
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-3xs overflow-hidden divide-y divide-gray-50">
                        {/* Curtidas */}
                        <div className="p-4 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700">{t('likes')}</span>
                          <button
                            disabled={!allowNotifications}
                            onClick={() => setNotifLikes(!notifLikes)}
                            className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!allowNotifications ? 'opacity-40 cursor-not-allowed' : ''} ${notifLikes && allowNotifications ? 'bg-[#1E3F20]' : 'bg-neutral-200'}`}
                          >
                            <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${notifLikes && allowNotifications ? 'translate-x-4.5' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        {/* Apreciações Profundas */}
                        <div className="p-4 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700">{t('deepAppreciations')}</span>
                          <button
                            disabled={!allowNotifications}
                            onClick={() => setNotifAppreciations(!notifAppreciations)}
                            className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!allowNotifications ? 'opacity-40 cursor-not-allowed' : ''} ${notifAppreciations && allowNotifications ? 'bg-[#1E3F20]' : 'bg-neutral-200'}`}
                          >
                            <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${notifAppreciations && allowNotifications ? 'translate-x-4.5' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        {/* Notas */}
                        <div className="p-4 flex items-center justify-between">
                          <div className="text-left space-y-0.5">
                            <span className="text-xs font-semibold text-gray-700 block">{t('notes')}</span>
                            <span className="text-[9px] text-gray-400 block">{t('notesSub')}</span>
                          </div>
                          <button
                            disabled={!allowNotifications}
                            onClick={() => setNotifNotes(!notifNotes)}
                            className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!allowNotifications ? 'opacity-40 cursor-not-allowed' : ''} ${notifNotes && allowNotifications ? 'bg-[#1E3F20]' : 'bg-neutral-200'}`}
                          >
                            <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${notifNotes && allowNotifications ? 'translate-x-4.5' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        {/* Curtidas em Comentários */}
                        <div className="p-4 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700">{t('likesOnComments')}</span>
                          <button
                            disabled={!allowNotifications}
                            onClick={() => setNotifCommentLikes(!notifCommentLikes)}
                            className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!allowNotifications ? 'opacity-40 cursor-not-allowed' : ''} ${notifCommentLikes && allowNotifications ? 'bg-[#1E3F20]' : 'bg-neutral-200'}`}
                          >
                            <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${notifCommentLikes && allowNotifications ? 'translate-x-4.5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 7. SETTINGS: NOTIFICATIONS FOLLOWS --- */}
                {settingsScreen === 'notifications_follows' && (
                  <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] animate-fadeIn text-left">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-20">
                      <button 
                        onClick={() => setSettingsScreen('notifications')} 
                        className="p-1.5 -ml-1 hover:bg-neutral-50 rounded-full transition cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-800" />
                      </button>
                      <span className="text-sm font-bold text-gray-900">{t('followingFollowers')}</span>
                      <div className="w-8"></div>
                    </div>

                    {/* Options list */}
                    <div className="flex-1 p-4 space-y-4 text-left overflow-y-auto pb-20">
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-3xs overflow-hidden divide-y divide-gray-50">
                        {/* Novos Seguidores */}
                        <div className="p-4 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700">{t('newFollowers')}</span>
                          <button
                            disabled={!allowNotifications}
                            onClick={() => setNotifNewFollowers(!notifNewFollowers)}
                            className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!allowNotifications ? 'opacity-40 cursor-not-allowed' : ''} ${notifNewFollowers && allowNotifications ? 'bg-[#1E3F20]' : 'bg-neutral-200'}`}
                          >
                            <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${notifNewFollowers && allowNotifications ? 'translate-x-4.5' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        {/* Solicitações Aceitas */}
                        <div className="p-4 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700">{t('acceptedRequests')}</span>
                          <button
                            disabled={!allowNotifications}
                            onClick={() => setNotifAcceptedRequests(!notifAcceptedRequests)}
                            className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!allowNotifications ? 'opacity-40 cursor-not-allowed' : ''} ${notifAcceptedRequests && allowNotifications ? 'bg-[#1E3F20]' : 'bg-neutral-200'}`}
                          >
                            <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${notifAcceptedRequests && allowNotifications ? 'translate-x-4.5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 8. SETTINGS: LANGUAGE SELECTION SCREEN --- */}
                {settingsScreen === 'language' && (
                  <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] animate-fadeIn text-left">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-20">
                      <button 
                        onClick={() => setSettingsScreen('main')} 
                        className="p-1.5 -ml-1 hover:bg-neutral-50 rounded-full transition cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-800" />
                      </button>
                      <span className="text-sm font-bold text-gray-900">{t('language')}</span>
                      <div className="w-8"></div>
                    </div>

                    {/* Language Selection List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white">
                      {['Português', 'English', 'Español', 'Français', 'Deutsch', '简体中文', '繁體中文', '日本語'].map((lang) => {
                        const isActive = language === lang;
                        const flagMap: Record<string, string> = {
                          'Português': '🇧🇷',
                          'English': '🇺🇸',
                          'Español': '🇪🇸',
                          'Français': '🇫🇷',
                          'Deutsch': '🇩🇪',
                          '简体中文': '🇨🇳',
                          '繁體中文': '🇭🇰',
                          '日本語': '🇯🇵'
                        };

                        return (
                          <div 
                            key={lang}
                            onClick={() => {
                              setLanguage(lang);
                              setSettingsScreen('main');
                            }}
                            className="px-5 py-4 flex items-center justify-between hover:bg-neutral-50/50 cursor-pointer transition select-none text-left"
                          >
                            <div className="flex items-center space-x-3 text-xs font-semibold text-gray-800">
                              <span className="text-base">{flagMap[lang] || '🌐'}</span>
                              <span>{lang}</span>
                            </div>
                            {isActive && (
                              <svg className="w-4 h-4 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* --- 9. ORIGINAL PROFILE VIEW (Rendered when settingsScreen === null) --- */}
                {settingsScreen === null && (
                  <div className="flex-1 flex flex-col h-full overflow-y-auto">
                    {/* HIGH-FIDELITY SCREEN HEADER */}
                    <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-20">
                      <span className="text-lg font-bold text-gray-900 tracking-tight">@{profile.username}</span>
                      
                      <div className="flex items-center space-x-2">
                        {/* Dark forest green 'Convidar' button from screenshot */}
                        <button 
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: 'Cloz',
                                text: `Me siga no Cloz: @${profile.username}!`,
                                url: window.location.href,
                              }).catch(err => console.warn(err));
                            } else {
                              navigator.clipboard.writeText(`https://cloz.app/${profile.username}`);
                              alert("Link de convite copiado para a área de transferência!");
                            }
                          }}
                          className="bg-[#1E3F20] hover:bg-neutral-800 text-white px-4 py-1.8 rounded-xl text-xs font-bold transition cursor-pointer shadow-3xs"
                        >
                          {t('invite')}
                        </button>

                        {/* Standard share/upload iOS button icon from top right of the screenshot */}
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link do perfil copiado!");
                          }}
                          className="p-2 text-gray-800 hover:bg-neutral-50 rounded-full transition cursor-pointer"
                        >
                          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Profile header details */}
                    <div className="p-5 bg-white space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Avatar with top-right custom Level badge matching screenshot */}
                          <div className="relative shrink-0">
                            <img 
                              src={profile.avatar} 
                              className="w-[72px] h-[72px] rounded-full object-cover border-2 border-white shadow-xs" 
                              alt="avatar" 
                            />
                            {/* Custom visual badge representing Level / Trend (e.g. "↗ 3") */}
                            <div className="absolute -top-1.5 -right-1.5 bg-white border border-neutral-200 shadow-3xs rounded-full px-1.8 py-0.5 text-[9px] font-bold text-gray-800 flex items-center space-x-0.5">
                              <span className="font-mono text-gray-500 font-extrabold">↗</span>
                              <span>{Math.floor(profile.auraScore / 10) + 3}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1.5">
                              {/* Name ("Rick") with beautiful Instagram-style pinkish camera brand icon */}
                              <h3 className="font-display font-extrabold text-base text-gray-900 leading-none">
                                {profile.name || 'Rick'}
                              </h3>
                              
                              <button
                                onClick={() => {
                                  const ig = profile.instagram || 'rickzinxx_';
                                  window.open(`https://instagram.com/${ig}`, '_blank');
                                }}
                                className="p-1 hover:bg-neutral-100 rounded-full transition cursor-pointer flex items-center justify-center shrink-0"
                                title="Instagram"
                              >
                                <svg className="w-3.5 h-3.5 text-pink-500 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                              </button>
                            </div>
                            
                            <span className="text-xs font-medium text-gray-400 block">
                              {profile.followersCount || 3} <span className="text-gray-400/80">{t('followers')}</span> &nbsp;/&nbsp; {profile.followingCount || 6} <span className="text-gray-400/80">{t('following')}</span>
                            </span>
                          </div>
                        </div>

                        {/* Settings Gear inside custom red ring matching the screenshot perfectly */}
                        <button 
                          onClick={() => setSettingsScreen('main')}
                          className="relative p-1 rounded-full border border-red-500/80 hover:scale-105 transition duration-200 shadow-3xs flex items-center justify-center cursor-pointer bg-white"
                        >
                      <div className="p-1.5 rounded-full hover:bg-neutral-50 transition">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </button>
                  </div>

                  {/* Badges Row (Matches Location Pill and Red Locked Stats Pill) */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {/* Location Badge with MapPin */}
                    <button 
                      onClick={async () => {
                        const newLoc = prompt('Digite sua localização (Cidade, País):', profile.location);
                        if (newLoc !== null) {
                          const updated = { ...profile, location: newLoc };
                          setProfile(updated);
                          await setDoc(doc(db, 'users', profile.uid), updated);
                        }
                      }}
                      className="flex items-center space-x-1.5 border border-gray-200/80 bg-neutral-50/50 px-3 py-1.8 rounded-full text-gray-700 font-mono text-[11px] font-bold hover:bg-neutral-100 transition duration-200 cursor-pointer shadow-3xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-gray-400 stroke-[2.5]" />
                      <span>{profile.location || 'São Paulo, Brazil'}</span>
                      <ChevronRight className="w-3 h-3 text-gray-400 stroke-[2.5]" />
                    </button>

                    {/* Locked Stats Red Pill: background white, red border, red text */}
                    <div className="flex items-center space-x-1.5 border border-red-500/80 bg-white px-3.5 py-1.8 rounded-full text-[#D32F2F] font-mono text-[11px] font-bold shadow-3xs">
                      <span>🔒</span>
                      <span>{looks.filter(l => l.userId === profile.uid).length || 3} / 12</span>
                      {/* Simple Bar Chart SVG */}
                      <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Sub tabs inside profile (Calendar, Looks, Closet) - Minimalist ICONS ONLY matching the screenshot */}
                  <div className="flex border-b border-gray-100/60 pb-1 pt-2">
                    <button 
                      onClick={() => setProfileSubTab('calendar')}
                      className={`flex-1 text-center py-3 border-b-2 font-display text-xs font-bold flex items-center justify-center cursor-pointer transition ${profileSubTab === 'calendar' ? 'border-black text-black' : 'border-transparent text-gray-300 hover:text-gray-500'}`}
                    >
                      <CalendarIcon className="w-5 h-5 stroke-[2]" />
                    </button>
                    <button 
                      onClick={() => setProfileSubTab('camera')}
                      className={`flex-1 text-center py-3 border-b-2 font-display text-xs font-bold flex items-center justify-center cursor-pointer transition ${profileSubTab === 'camera' ? 'border-black text-black' : 'border-transparent text-gray-300 hover:text-gray-500'}`}
                    >
                      <Camera className="w-5 h-5 stroke-[2]" />
                    </button>
                    <button 
                      onClick={() => setProfileSubTab('closet')}
                      className={`flex-1 text-center py-3 border-b-2 font-display text-xs font-bold flex items-center justify-center cursor-pointer transition ${profileSubTab === 'closet' ? 'border-black text-black' : 'border-transparent text-gray-300 hover:text-gray-500'}`}
                    >
                      <Shirt className="w-5 h-5 stroke-[2]" />
                    </button>
                  </div>
                </div>

                {/* --- SUB-TAB CONTENT --- */}
                
                {/* Subtab 1: Calendar View */}
                {profileSubTab === 'calendar' && (
                  <div className="p-3 space-y-4 animate-fadeIn pb-12 bg-white flex-1">
                    {/* Centered Month with Upload iOS Icon next to it */}
                    <div className="flex items-center justify-center space-x-1.5 py-1 text-gray-800 font-medium">
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="font-sans lowercase text-sm">julho de 2026</span>
                    </div>

                    {/* Portuguese Weekdays Headers Row */}
                    <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-gray-500 border-b border-gray-100 pb-2">
                      <span>Se</span>
                      <span>Te</span>
                      <span>Qu</span>
                      <span>Qu</span>
                      <span>Se</span>
                      <span>Sá</span>
                      <span>Do</span>
                    </div>

                    {/* Calendar Days Grid */}
                    <div className="grid grid-cols-7 bg-white border border-gray-100 rounded-none overflow-hidden">
                      {getCalendarDays().map((dayObj, idx) => {
                        const hasWeather = dayObj.day && weatherForecast[dayObj.day];
                        const isToday = dayObj.day === 17;

                        return (
                          <div 
                            key={idx} 
                            className="aspect-[1/1.6] relative flex flex-col items-center border border-gray-100 bg-white p-1 select-none overflow-hidden"
                          >
                            {dayObj.day && (
                              <div className="w-full flex justify-start mb-0.5">
                                {isToday ? (
                                  <span className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[10px] font-bold text-black bg-white">
                                    {dayObj.day}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono text-gray-400 p-0.5 leading-none">
                                    {dayObj.day}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Show outfit look image if uploaded */}
                            {dayObj.hasLook ? (
                              <div 
                                onClick={() => setSelectedLook(dayObj.hasLook)}
                                className="absolute inset-0.5 rounded overflow-hidden cursor-pointer shadow-3xs transition hover:scale-[1.03] z-10"
                              >
                                <img 
                                  src={dayObj.hasLook.image} 
                                  className="w-full h-full object-cover" 
                                  alt="calendar look" 
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ) : (
                              dayObj.day && hasWeather && (
                                <div className="flex-1 flex flex-col items-center justify-between w-full pb-0.5">
                                  {/* Weather Icon (Custom hand-styled matching the screenshot aesthetics) */}
                                  <div className="flex-1 flex items-center justify-center">
                                    {weatherForecast[dayObj.day].icon === 'sun' && (
                                      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                        <circle cx="12" cy="12" r="5" stroke="currentColor" fill="currentColor" fillOpacity="0.1" />
                                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                      </svg>
                                    )}
                                    {weatherForecast[dayObj.day].icon === 'sun-cloud' && (
                                      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path d="M12 2v2M4.22 4.22l1.42 1.42M1 12h2" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14.5a3.5 3.5 0 10-7-2.65 3.5 3.5 0 11-4.24-4.24A4.5 4.5 0 0119 14.5z" />
                                      </svg>
                                    )}
                                    {weatherForecast[dayObj.day].icon === 'cloud' && (
                                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                      </svg>
                                    )}
                                    {weatherForecast[dayObj.day].icon === 'rain' && (
                                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="text-neutral-500" d="M8 20l-1 2M12 20l-1 2M16 20l-1 2" />
                                      </svg>
                                    )}
                                  </div>

                                  {/* Max Temperature / High */}
                                  <span className="text-[11px] font-extrabold text-gray-800 leading-none">
                                    {weatherForecast[dayObj.day].tempMax}°C
                                  </span>

                                  {/* Min Temperature / Low */}
                                  <span className="text-[9px] font-medium text-gray-400 leading-none mt-0.5">
                                    {weatherForecast[dayObj.day].tempMin}°C
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Extra Statistics Banner */}
                    <div className="p-3.5 bg-[#E5E5E0]/20 rounded-2xl border border-gray-100 text-xs font-light leading-relaxed">
                      <p className="font-bold text-gray-800">Uso do Guarda-Roupa</p>
                      <p className="text-gray-500 text-[11px] mt-1">
                        Sua agenda de estilo está sincronizada em tempo real com a previsão de 
                        <span className="font-bold text-gray-700"> São Paulo</span>. Use sugestões de IA baseadas nas condições climáticas do dia!
                      </p>
                    </div>
                  </div>
                )}

                {/* Subtab 2: Looks Grid */}
                {profileSubTab === 'camera' && (
                  <div className="p-3 grid grid-cols-3 gap-2 animate-fadeIn pb-12">
                    {looks.filter(l => l.userId === profile.uid).map(look => (
                      <div 
                        key={look.id}
                        onClick={() => setSelectedLook(look)}
                        className="aspect-[3/4] relative rounded-xl overflow-hidden cursor-pointer group border border-gray-100"
                      >
                        <img src={look.image} className="w-full h-full object-cover group-hover:scale-105 transition" alt="look" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-1.5 opacity-0 group-hover:opacity-100 transition">
                          <span className="text-[8px] font-mono text-white flex items-center gap-0.5">
                            <Heart className="w-2 h-2 fill-white text-white" /> {look.likes}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtab 3: Digital Closet List */}
                {profileSubTab === 'closet' && (
                  <div className="p-3 space-y-4 animate-fadeIn pb-12">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Seu Guarda-Roupa ({closet.filter(c => c.userId === profile.uid).length} Peças)</span>
                      <button 
                        onClick={() => setIsAddingClosetItem(true)}
                        className="bg-black text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 hover:bg-neutral-800 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Adicionar</span>
                      </button>
                    </div>

                    {/* Simple Closet Form popup */}
                    {isAddingClosetItem && (
                      <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-md space-y-2.5 text-xs text-left">
                        <div className="flex justify-between items-center pb-1 border-b border-gray-100">
                          <span className="font-bold text-gray-800">Cadastrar Nova Peça</span>
                          <button onClick={() => setIsAddingClosetItem(false)} className="text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
                        </div>
                        <div className="space-y-1.5">
                          <input 
                            type="text" 
                            placeholder="Nome da peça (ex: Casaco Corta Vento)" 
                            value={closetItemName}
                            onChange={(e) => setClosetItemName(e.target.value)}
                            className="w-full bg-neutral-50 p-2 rounded outline-none border border-gray-100 text-[11px]"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" 
                              placeholder="Marca" 
                              value={closetItemBrand}
                              onChange={(e) => setClosetItemBrand(e.target.value)}
                              className="w-full bg-neutral-50 p-2 rounded outline-none border border-gray-100 text-[11px]"
                            />
                            <input 
                              type="number" 
                              placeholder="Preço (R$)" 
                              value={closetItemPrice}
                              onChange={(e) => setClosetItemPrice(e.target.value)}
                              className="w-full bg-neutral-50 p-2 rounded outline-none border border-gray-100 text-[11px]"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span className="text-gray-500">Disponível para venda?</span>
                            <input 
                              type="checkbox" 
                              checked={closetItemForSale}
                              onChange={(e) => setClosetItemForSale(e.target.checked)}
                              className="accent-black"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[9px] font-mono text-gray-400">Categoria</span>
                              <select 
                                value={closetItemCategory} 
                                onChange={(e) => setClosetItemCategory(e.target.value as any)}
                                className="w-full bg-neutral-50 p-1.5 rounded text-[10px]"
                              >
                                <option value="Jeans">Jeans / Calça</option>
                                <option value="Jaqueta">Jaqueta / Casaco</option>
                                <option value="Camiseta">Camiseta / Camisa</option>
                                <option value="Sapato">Sapato / Tênis</option>
                                <option value="Acessório">Acessório</option>
                                <option value="Outros">Outros</option>
                              </select>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-gray-400">Foto da Peça Real</span>
                              <label className="flex items-center justify-center bg-neutral-50 border border-dashed border-gray-200 hover:border-black rounded p-1.5 text-[10px] cursor-pointer font-semibold transition text-center truncate max-w-full">
                                <span>{closetItemImage ? '✓ Foto Carregada' : 'Selecionar Foto'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === 'string') {
                                          setClosetItemImage(reader.result);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={handleAddClosetItem}
                          disabled={!closetItemName || !closetItemImage}
                          className="w-full bg-black text-white py-2 rounded text-[11px] font-bold disabled:opacity-40 transition"
                        >
                          Confirmar Peça
                        </button>
                      </div>
                    )}

                    {/* Closet items layout */}
                    <div className="grid grid-cols-2 gap-3.5">
                      {closet.filter(c => c.userId === profile.uid).map(item => (
                        <div 
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-2xs group cursor-pointer text-left hover:border-gray-300 transition"
                        >
                          <div className="aspect-square bg-neutral-50 relative overflow-hidden">
                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition" alt="closet item" />
                            <span className="absolute bottom-2 left-2 bg-neutral-900/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[7px] font-mono tracking-wider px-1.5 py-0.5 rounded shadow-sm z-10 flex items-center gap-0.5">
                              <span>3D</span> <Sparkles className="w-2 h-2 text-amber-300 animate-pulse" />
                            </span>
                            {item.forSale && (
                              <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                                R$ {item.price}
                              </span>
                            )}
                          </div>
                          <div className="p-2.5 space-y-1.5 text-xs">
                            <div>
                              <span className="text-[9px] font-mono text-gray-400 block">{item.brand}</span>
                              <p className="font-bold text-gray-800 truncate leading-none mt-0.5">{item.name}</p>
                            </div>
                            
                            {/* Cost per Wear display */}
                            <div className="bg-neutral-50 p-1.5 rounded-lg border border-gray-100 flex justify-between items-center text-[10px]">
                              <span className="text-gray-400 font-light">Custo/Uso:</span>
                              <span className="font-mono font-bold text-[#3A3F35]">R$ {item.costPerWear.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>
            )}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM NAV BAR (Mobile Only, Fixed to screen bottom) */}
      {profile && (
        <div className="fixed bottom-0 inset-x-0 h-16 bg-white/95 backdrop-blur-md z-40 border-t border-gray-200/60 flex md:hidden items-center justify-around px-4 text-gray-400 select-none shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <button 
            onClick={() => { setActiveTab('feed'); setSelectedLook(null); setSelectedItem(null); }}
            className={`flex flex-col items-center justify-center p-1 cursor-pointer transition ${activeTab === 'feed' ? 'text-black font-bold' : 'hover:text-neutral-600'}`}
          >
            <BookOpen className="w-5 h-5 stroke-[2px]" />
            <span className="text-[9px] font-semibold mt-1">Feed</span>
          </button>
          
          <button 
            onClick={() => { setActiveTab('explore'); setSelectedLook(null); setSelectedItem(null); }}
            className={`flex flex-col items-center justify-center p-1 cursor-pointer transition ${activeTab === 'explore' ? 'text-black font-bold' : 'hover:text-neutral-600'}`}
          >
            <Search className="w-5 h-5 stroke-[2px]" />
            <span className="text-[9px] font-semibold mt-1">Buscar</span>
          </button>
          
          <button 
            onClick={() => { setActiveTab('add'); setSelectedLook(null); setSelectedItem(null); }}
            className="flex flex-col items-center justify-center bg-black hover:bg-neutral-800 text-white w-10 h-10 rounded-full cursor-pointer transition-all active:scale-90 shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => { setActiveTab('notifications'); setSelectedLook(null); setSelectedItem(null); }}
            className={`flex flex-col items-center justify-center p-1 cursor-pointer relative transition ${activeTab === 'notifications' ? 'text-black font-bold' : 'hover:text-neutral-600'}`}
          >
            <Bell className="w-5 h-5 stroke-[2px]" />
            <span className="text-[9px] font-semibold mt-1">Avisos</span>
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            )}
          </button>
          
          <button 
            onClick={() => { setActiveTab('profile'); setSelectedLook(null); setSelectedItem(null); }}
            className={`flex flex-col items-center justify-center p-1 cursor-pointer transition ${activeTab === 'profile' ? 'text-black font-bold' : 'hover:text-neutral-600'}`}
          >
            <User className="w-5 h-5 stroke-[2px]" />
            <span className="text-[9px] font-semibold mt-1">Perfil</span>
          </button>
        </div>
      )}

        {/* --- DYNAMIC INTERACTIVE DETAIL MODALS --- */}
        
        {/* LOOK DETAILS DRAWER */}
        <AnimatePresence>
          {selectedLook && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-[32px] w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col text-left border border-gray-100"
              >
              {/* Confirm Deletion Overlay */}
              <AnimatePresence>
                {isConfirmingDelete && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-6 text-center space-y-4"
                  >
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 animate-bounce">
                      <Trash className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-base text-gray-900">Excluir Post?</h4>
                      <p className="text-gray-500 text-[11px] mt-1.5 leading-relaxed max-w-xs">
                        Tem certeza de que deseja apagar esta composição do seu perfil? Esta ação não pode ser desfeita.
                      </p>
                    </div>
                    <div className="flex flex-col w-full max-w-xs space-y-2">
                      <button 
                        onClick={() => handleDeleteLook(selectedLook.id)}
                        disabled={isDeletingLook}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isDeletingLook ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                          <span>Sim, Apagar Post</span>
                        )}
                      </button>
                      <button 
                        onClick={() => setIsConfirmingDelete(false)}
                        disabled={isDeletingLook}
                        className="w-full bg-neutral-100 hover:bg-neutral-200 text-gray-800 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* HIGH-FIDELITY SCREEN HEADER (Directly matches Screenshot 1) */}
              <div className="px-4 py-3.5 border-b border-gray-100/80 flex items-center justify-between bg-white sticky top-0 z-20">
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <button 
                    onClick={() => setSelectedLook(null)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 hover:bg-neutral-100 text-gray-700 transition shrink-0 cursor-pointer"
                  >
                    <ArrowLeft className="w-4.5 h-4.5 stroke-[2.5]" />
                  </button>
                  
                  {/* User Avatar with pulsing Aura ring if they have followers */}
                  <div className="relative shrink-0">
                    <img 
                      src={selectedLook.userAvatar} 
                      className={`w-8 h-8 rounded-full object-cover ${
                        (() => {
                          const userObj = selectedLook.userId === profile?.uid ? profile : allUsers.find(u => u.uid === selectedLook.userId);
                          const followers = userObj?.followersCount || 0;
                          return followers > 0 
                            ? "ring-2 ring-emerald-400 ring-offset-1 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.35)]" 
                            : "border border-gray-100";
                        })()
                      }`} 
                      alt="avatar" 
                    />
                  </div>
                  
                  <span className="text-xs font-bold text-gray-900 truncate shrink-0 max-w-[120px]">@{selectedLook.username}</span>

                  {/* Follow Button: Solid Green or Light Grey next to username */}
                  {profile && selectedLook.userId !== profile.uid && (
                    <button 
                      onClick={() => handleFollowUser(selectedLook.userId)}
                      className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold transition shrink-0 cursor-pointer shadow-3xs ${
                        profile.following && profile.following.includes(selectedLook.userId)
                          ? 'bg-neutral-100 text-gray-500 hover:bg-neutral-200/70 border border-gray-200'
                          : 'bg-[#1E3F20] hover:bg-neutral-800 text-white'
                      }`}
                    >
                      {profile.following && profile.following.includes(selectedLook.userId) ? 'Seguindo' : 'Seguir'}
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {/* Delete Button for Owner */}
                  {profile && selectedLook.userId === profile.uid && (
                    <button 
                      onClick={() => setIsConfirmingDelete(true)}
                      className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition flex items-center justify-center cursor-pointer"
                      title="Apagar Post"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button className="w-8 h-8 rounded-full hover:bg-neutral-50 text-gray-400 hover:text-black flex items-center justify-center transition cursor-pointer">
                    <span className="font-extrabold text-sm tracking-widest leading-none">...</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto">
                
                {/* Look Image Container with Elegant Overlay Badges */}
                <div className="relative aspect-[3/4] bg-neutral-50 w-full overflow-hidden">
                  <img src={selectedLook.image} className="w-full h-full object-cover select-none pointer-events-none" alt="composition detail" />
                  
                  {/* Floating Overlay elements exactly matching screenshot */}
                  <div className="absolute inset-x-3 top-3 flex justify-between items-start pointer-events-none">
                    <button className="p-2 rounded-full bg-black/25 backdrop-blur-md text-white border border-white/10 hover:bg-black/40 transition pointer-events-auto shadow-sm">
                      <Maximize2 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Share button fixed on the bottom-left of the image */}
                  <div className="absolute left-3 bottom-3 pointer-events-auto">
                    <button className="bg-black/25 backdrop-blur-md border border-white/10 px-3.5 py-1.8 rounded-full flex items-center space-x-1.5 text-[10px] font-bold text-white shadow-sm hover:bg-black/45 transition">
                      <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Compartilhar</span>
                    </button>
                  </div>

                  {/* Action buttons stacked vertically on the bottom-right of the image */}
                  <div className="absolute right-3 bottom-3 flex flex-col space-y-2 pointer-events-auto items-center">
                    {/* Refresh Circular button */}
                    <button className="p-2.5 rounded-full bg-black/25 backdrop-blur-md text-white border border-white/10 hover:bg-black/40 transition shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3" />
                      </svg>
                    </button>
                    
                    {/* Heart / Like Action */}
                    <button 
                      onClick={(e) => handleLikeLook(selectedLook.id, e)}
                      className="p-2.5 rounded-full bg-black/25 backdrop-blur-md text-white border border-white/10 hover:bg-black/40 transition shadow-sm"
                    >
                      <Heart className={`w-4 h-4 stroke-[2.5] ${profile && selectedLook.likedBy.includes(profile.uid) ? 'fill-red-500 text-red-500 border-none' : 'text-white'}`} />
                    </button>
                  </div>
                </div>

                {/* Aesthetic Selector Tabs with green bottom indicator bar */}
                <div className="border-b border-gray-100 flex items-center justify-around bg-white sticky top-[61px] z-10 select-none">
                  <button 
                    onClick={() => setLookDetailTab('analytics')}
                    className={`flex-1 py-3.5 text-xs font-bold transition flex items-center justify-center space-x-2 border-b-2 cursor-pointer ${
                      lookDetailTab === 'analytics'
                        ? 'border-[#1E3F20] text-[#1E3F20]'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 stroke-[2.2]" />
                    <span>Estética</span>
                  </button>
                  <button 
                    onClick={() => setLookDetailTab('pieces')}
                    className={`flex-1 py-3.5 text-xs font-bold transition flex items-center justify-center space-x-2 border-b-2 cursor-pointer ${
                      lookDetailTab === 'pieces'
                        ? 'border-[#1E3F20] text-[#1E3F20]'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <span className="text-base leading-none">👕</span>
                    <span>Peças</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-neutral-100 text-neutral-500">
                      {selectedLook.tags?.length || 0}
                    </span>
                  </button>
                </div>

                {/* Tab content wrapper */}
                <div className="p-4 space-y-5 pb-24">
                  
                  {/* TAB 1: AESTHETICS AND ANALYTICS PROFILE */}
                  {lookDetailTab === 'analytics' && (
                    <div className="space-y-5 animate-fadeIn">
                      
                      {/* Style Name and Metadata */}
                      <div className="space-y-2">
                        <h3 className="font-sans font-black text-xl tracking-tight text-gray-950 leading-snug">
                          {selectedLook.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono text-gray-400">
                            17 de julho de 2026
                          </span>
                          <span className="bg-neutral-50 border border-gray-100 rounded-full px-2.5 py-1 text-[10px] font-bold text-gray-500/90 flex items-center gap-1 shadow-3xs">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span>{selectedLook.location || 'Fortaleza, Brazil'}</span>
                            <span className="text-[8px] text-gray-300 font-normal ml-0.5">&gt;</span>
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-600/90 font-light leading-relaxed pt-1">
                          {selectedLook.description}
                          <span className="text-emerald-700 font-bold ml-1.5 cursor-pointer hover:underline">Ler mais</span>
                        </p>
                      </div>

                      {/* Color Palette Cards (Scrollable List as shown in Screenshot 2) */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest block">
                          Composição Cromática
                        </span>
                        
                        <div className="flex space-x-3.5 overflow-x-auto pb-1.5 scrollbar-thin select-none">
                          {(() => {
                            const palette = [
                              { name: 'Azul Superioridade', pct: '51%', hex: '#72A0C1', color: '#72A0C1' },
                              { name: 'Marinho Puro', pct: '25%', hex: '#000080', color: '#000080' },
                              { name: 'Café Paris', pct: '15%', hex: '#4B3621', color: '#4B3621' }
                            ];
                            return palette.map((col, idx) => (
                              <div 
                                key={idx} 
                                className="bg-neutral-50/50 hover:bg-neutral-50 transition border border-gray-100 rounded-2xl p-3 min-w-[145px] flex flex-col justify-between space-y-4 shrink-0 shadow-3xs relative overflow-hidden group cursor-pointer"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="w-6.5 h-6.5 rounded-full border border-black/5 flex shadow-2xs" style={{ backgroundColor: col.color }} />
                                  <span className="text-sm font-black font-mono text-gray-900 leading-none mt-1">{col.pct}</span>
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-[10px] font-bold text-gray-800 truncate leading-tight">{col.name}</p>
                                  <span className="text-[8px] font-mono text-gray-400 block">{col.hex}</span>
                                </div>
                                <span className="absolute right-2 bottom-2 text-[10px] text-gray-300 group-hover:text-emerald-600 transition">&gt;</span>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Aesthetics Segment lines (Matches Screenshot 2 bottom half) */}
                      <div className="space-y-3.5 bg-neutral-50/40 border border-gray-100 p-4 rounded-[24px]">
                        <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest block">
                          Vetores Estéticos
                        </span>

                        <div className="space-y-2.5">
                          {[
                            { name: 'Parisiense', filled: 3 },
                            { name: 'Sotto', filled: 2 },
                            { name: 'Androginia', filled: 1 },
                            { name: 'Gamine', filled: 1 }
                          ].map((ae, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="font-medium text-gray-700">{ae.name}</span>
                              
                              {/* 4 Blocked Segment Bar */}
                              <div className="flex space-x-1 w-24">
                                {[1, 2, 3, 4].map(block => (
                                  <div 
                                    key={block} 
                                    className={`h-2 flex-1 rounded-sm transition-all duration-500 ${
                                      block <= ae.filled ? 'bg-[#3E5C46]' : 'bg-gray-200/60'
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Radar / Spider Hexagon Chart (Matches Screenshot 3) */}
                      <div className="space-y-3 bg-neutral-50/40 border border-gray-100 p-4 rounded-[24px] flex flex-col items-center">
                        <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest block w-full text-left">
                          Impressão Geométrica
                        </span>

                        {/* Beautifully drawn SVG Spider Radar Chart */}
                        <div className="relative w-44 h-44 my-2">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
                            {/* Outer, Middle, and Inner hexagon grid borders */}
                            {[40, 28, 16].map((r, ri) => {
                              const pointsStr = Array.from({ length: 6 }).map((_, idx) => {
                                const angle = (idx * Math.PI) / 3 - Math.PI / 2;
                                const x = 50 + r * Math.cos(angle);
                                const y = 50 + r * Math.sin(angle);
                                return `${x},${y}`;
                              }).join(' ');
                              return (
                                <polygon 
                                  key={ri} 
                                  points={pointsStr} 
                                  fill="none" 
                                  stroke="#E2E8F0" 
                                  strokeWidth="0.75" 
                                  strokeDasharray={ri === 2 ? "1,1" : "none"}
                                />
                              );
                            })}

                            {/* Spoke lines from center */}
                            {Array.from({ length: 6 }).map((_, idx) => {
                              const angle = (idx * Math.PI) / 3 - Math.PI / 2;
                              const x = 50 + 40 * Math.cos(angle);
                              const y = 50 + 40 * Math.sin(angle);
                              return (
                                <line 
                                  key={idx} 
                                  x1="50" y1="50" 
                                  x2={x} y2={y} 
                                  stroke="#E2E8F0" 
                                  strokeWidth="0.75" 
                                />
                              );
                            })}

                            {/* Actual green shape representation polygon */}
                            {(() => {
                              // Custom layout dimensions for a distinctive polygon shape
                              const polygonValues = [35, 22, 30, 15, 18, 25];
                              const polygonPointsStr = polygonValues.map((val, idx) => {
                                const angle = (idx * Math.PI) / 3 - Math.PI / 2;
                                const x = 50 + val * Math.cos(angle);
                                const y = 50 + val * Math.sin(angle);
                                return `${x},${y}`;
                              }).join(' ');

                              return (
                                <polygon 
                                  points={polygonPointsStr} 
                                  fill="rgba(62, 92, 70, 0.22)" 
                                  stroke="#3E5C46" 
                                  strokeWidth="1.5" 
                                />
                              );
                            })()}
                          </svg>

                          {/* Dynamic Radar Positioning Labels with Space Grotesk size */}
                          <span className="absolute top-[-8px] left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-500 font-mono tracking-wider">Casual</span>
                          <span className="absolute top-[28px] right-[-14px] text-[9px] font-bold text-gray-500 font-mono tracking-wider">Sóbrio</span>
                          <span className="absolute bottom-[28px] right-[-14px] text-[9px] font-bold text-gray-500 font-mono tracking-wider">Discreto</span>
                          <span className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-500 font-mono tracking-wider">Formal</span>
                          <span className="absolute bottom-[28px] left-[-14px] text-[9px] font-bold text-gray-500 font-mono tracking-wider">Vibrante</span>
                          <span className="absolute top-[28px] left-[-14px] text-[9px] font-bold text-gray-500 font-mono tracking-wider">Marcante</span>
                        </div>
                      </div>

                      {/* Real Active Comments Thread */}
                      <div className="space-y-3.5 pt-4 border-t border-gray-100">
                        <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest block">
                          Comentários ({((selectedLook as any).comments || []).length})
                        </span>
                        
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                          {(selectedLook as any).comments && (selectedLook as any).comments.length > 0 ? (
                            (selectedLook as any).comments.map((c: any) => (
                              <div key={c.id} className="flex items-start space-x-2.5 text-xs">
                                <img src={c.avatar} className="w-7.5 h-7.5 rounded-full object-cover border border-gray-100" alt="avatar" />
                                <div className="bg-neutral-50 p-2.5 rounded-[18px] flex-1">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">@{c.username}</span>
                                    <span className="text-[8px] text-gray-400 font-mono">{c.timestamp}</span>
                                  </div>
                                  <p className="text-gray-600 mt-0.5 leading-snug font-light">{c.text}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-[10px] text-gray-400 italic">Nenhum comentário. Compartilhe sua opinião sobre este look!</p>
                          )}
                        </div>

                        {profile && (
                          <div className="flex items-center space-x-2 mt-2 pt-1.5">
                            <input 
                              type="text" 
                              placeholder="Opine sobre essa estética..."
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddComment();
                              }}
                              className="flex-1 bg-neutral-50 border border-gray-100 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:bg-white focus:border-black transition"
                            />
                            <button 
                              onClick={handleAddComment}
                              className="bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-neutral-800 active:scale-95 transition cursor-pointer"
                            >
                              Enviar
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* TAB 2: DETECTED ITEMS / CLOTHING PIECES (Matches Screenshot 4) */}
                  {lookDetailTab === 'pieces' && (
                    <div className="space-y-4.5 animate-fadeIn">
                      
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest block">
                          Peças Catalogadas ({selectedLook.tags?.length || 0})
                        </span>
                      </div>

                      {selectedLook.tags && selectedLook.tags.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3.5">
                          {selectedLook.tags.map(tag => {
                            const matchedClosetItem = closet.find(c => c.name.toLowerCase() === tag.name.toLowerCase());
                            const finalImage = matchedClosetItem?.image || tag.croppedImage || selectedLook.image;
                            
                            return (
                              <div 
                                key={tag.id}
                                onClick={() => {
                                  setSelectedItem(matchedClosetItem || {
                                    id: tag.id,
                                    userId: selectedLook.userId,
                                    name: tag.name,
                                    category: tag.category,
                                    brand: tag.brand,
                                    price: tag.price,
                                    image: finalImage,
                                    forSale: tag.forSale,
                                    boughtAt: '2026-07-16',
                                    timesWorn: 1,
                                    costPerWear: tag.price
                                  });
                                }}
                                className="bg-white rounded-2xl border border-gray-200/60 hover:border-gray-300 transition overflow-hidden shadow-3xs flex flex-col cursor-pointer text-left group"
                              >
                                <div className="aspect-square bg-neutral-50 relative overflow-hidden flex items-center justify-center p-2.5">
                                  <img 
                                    src={finalImage} 
                                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition duration-300" 
                                    alt="piece crop" 
                                  />
                                  <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md text-emerald-300 border border-emerald-500/10 text-[8px] font-mono tracking-wider px-1.5 py-0.5 rounded shadow-sm z-10 flex items-center gap-0.5">
                                    <span>3D</span> <Sparkles className="w-1.5 h-1.5 text-amber-300 animate-pulse" />
                                  </span>
                                  
                                  {tag.forSale && (
                                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                                      R$ {tag.price}
                                    </span>
                                  )}
                                </div>

                                <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
                                  <div>
                                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wide block">
                                      {tag.category || 'Peça'}
                                    </span>
                                    <p className="font-bold text-gray-900 text-xs leading-snug truncate mt-0.5">
                                      {tag.name}
                                    </p>
                                    <span className="text-[9px] text-gray-500 block truncate font-light mt-0.5">
                                      {tag.brand || 'Marca'}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between border-t border-gray-100 pt-1.5 mt-1 text-[10px]">
                                    <span className="text-emerald-600 font-bold font-mono">
                                      R$ {tag.price}
                                    </span>
                                    
                                    {tag.forSale && selectedLook.userId !== profile?.uid ? (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCheckoutItem({
                                            id: tag.id,
                                            userId: selectedLook.userId,
                                            name: tag.name,
                                            category: tag.category,
                                            brand: tag.brand,
                                            price: tag.price,
                                            image: finalImage,
                                            forSale: tag.forSale,
                                            boughtAt: '2026-07-16',
                                            timesWorn: 1,
                                            costPerWear: tag.price
                                          });
                                          setCheckoutSeller(`@${selectedLook.username}`);
                                        }}
                                        className="bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 px-2 py-0.8 rounded text-[9px] font-bold transition cursor-pointer"
                                      >
                                        Comprar
                                      </button>
                                    ) : (
                                      <span className="text-gray-400 text-[8px] font-mono font-medium uppercase tracking-wider">
                                        No Closet
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic text-center py-6">Nenhuma peça detectada ou catalogada nesta composição.</p>
                      )}

                    </div>
                  )}

                </div>

              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CLOSET ITEM DETAIL MODAL */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative flex flex-col text-left"
              >
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-black cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <span className="text-[10px] font-mono text-gray-400">PEÇA DO GUARDA-ROUPA</span>
                <span className="w-4"></span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-12">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center p-6 select-none cursor-grab active:cursor-grabbing">
                  {/* Toggle Button */}
                  <button 
                    onClick={() => {
                      setViewMode3D(!viewMode3D);
                      setRotationY(0);
                    }}
                    className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full px-2.5 py-1 text-[9px] font-mono tracking-wider flex items-center gap-1.5 z-20 backdrop-blur-md transition-all cursor-pointer"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
                    <span>{viewMode3D ? 'FOTO 2D' : 'PROJEÇÃO 3D'}</span>
                  </button>

                  {viewMode3D ? (
                    <div 
                      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
                      onMouseDown={(e) => { setIsDragging3D(true); setDragStartX(e.clientX); }}
                      onMouseMove={(e) => { if (isDragging3D) { const delta = e.clientX - dragStartX; setRotationY(p => p + delta * 1.5); setDragStartX(e.clientX); } }}
                      onMouseUp={() => setIsDragging3D(false)}
                      onMouseLeave={() => setIsDragging3D(false)}
                      onTouchStart={(e) => { setIsDragging3D(true); setDragStartX(e.touches[0].clientX); }}
                      onTouchMove={(e) => { if (isDragging3D) { const delta = e.touches[0].clientX - dragStartX; setRotationY(p => p + delta * 1.5); setDragStartX(e.touches[0].clientX); } }}
                      onTouchEnd={() => setIsDragging3D(false)}
                    >
                      {/* 3D Grid floor */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-black z-0" />
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] z-0" />

                      {/* 3D Hologram Scan Lines effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-1/2 w-full animate-pulse pointer-events-none z-10" style={{ animationDuration: '3s' }} />

                      {/* 3D Pedestal base */}
                      <div 
                        className="absolute w-44 h-11 bg-gradient-to-r from-emerald-500/10 via-emerald-500/30 to-emerald-500/10 rounded-full border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                        style={{ 
                          transform: 'rotateX(75deg) translateY(120px)',
                          transformStyle: 'preserve-3d'
                        }}
                      />

                      {/* Floating, rotating 3D Asset image */}
                      <div 
                        className="relative w-44 h-44 flex items-center justify-center transition-transform duration-75 select-none z-10"
                        style={{ 
                          transform: `perspective(800px) rotateY(${rotationY}deg) translateZ(0px)`,
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {/* Front Face */}
                        <div 
                          className="absolute inset-0 bg-[#F6F6F6] rounded-2xl p-3 border border-emerald-500/40 shadow-2xl flex items-center justify-center overflow-hidden"
                          style={{
                            backfaceVisibility: 'visible',
                            boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)'
                          }}
                        >
                          <img src={selectedItem.image} className="w-full h-full object-contain pointer-events-none select-none" alt="item front" />
                        </div>

                        {/* Back Face (mirrored for 3D realism) */}
                        <div 
                          className="absolute inset-0 bg-[#F6F6F6] rounded-2xl p-3 border border-emerald-500/40 shadow-2xl flex items-center justify-center overflow-hidden"
                          style={{
                            transform: 'rotateY(180deg) translateZ(1px)',
                            backfaceVisibility: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)'
                          }}
                        >
                          <img src={selectedItem.image} className="w-full h-full object-contain scale-x-[-1] pointer-events-none select-none" alt="item back" />
                        </div>
                      </div>

                      {/* Orbit guides or sparkles overlay */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-emerald-400 uppercase tracking-widest pointer-events-none animate-pulse">
                        Arraste para girar 3D
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      {/* Subtle hologram badge */}
                      <div className="absolute bottom-3 left-3 bg-neutral-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[8px] font-mono tracking-widest z-10 flex items-center gap-1">
                        <span>CLOZ 3D TWIN</span> <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
                      </div>
                      <img src={selectedItem.image} className="w-full h-full object-cover" alt="item 2d zoom" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">{selectedItem.brand}</span>
                  <h3 className="font-display font-extrabold text-lg text-gray-900 leading-tight">{selectedItem.name}</h3>
                  <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md inline-block mt-1 capitalize">{selectedItem.category}</span>
                </div>

                {/* Smart CPW Analysis */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-gray-100 space-y-3 text-xs">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">ÍNDICE DE CUSTO POR USO</span>
                  
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-2 rounded-xl border border-gray-100">
                      <span className="text-gray-400 block text-[9px]">Preço Estimado</span>
                      <span className="font-mono font-bold text-gray-800 text-xs">R$ {selectedItem.price.toFixed(2)}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-gray-100">
                      <span className="text-gray-400 block text-[9px]">Vezes Usada</span>
                      <span className="font-mono font-bold text-emerald-600 text-xs">{selectedItem.timesWorn || 1} vezes</span>
                    </div>
                  </div>

                  <div className="bg-[#171717] text-white p-3.5 rounded-xl flex justify-between items-center font-mono">
                    <span className="text-[10px] font-sans font-light">Custo Real por Uso:</span>
                    <span className="font-bold text-xs text-emerald-300">R$ {(selectedItem.price / (selectedItem.timesWorn || 1)).toFixed(2)}</span>
                  </div>
                  
                  <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                    *Toda vez que você posta uma foto no calendário de looks usando este item, o Cloz atualiza o índice automaticamente!
                  </p>
                </div>

                {/* Buy button */}
                {selectedItem.forSale && selectedItem.userId !== profile.uid ? (
                  <button 
                    onClick={() => {
                      setCheckoutItem(selectedItem);
                      setCheckoutSeller(selectedItem.userId);
                    }}
                    className="w-full bg-black text-white py-3.5 rounded-2xl text-xs font-bold hover:bg-neutral-800 transition active:scale-98 cursor-pointer"
                  >
                    Comprar esta Peça (R$ {selectedItem.price})
                  </button>
                ) : (
                  <div className="p-3 bg-neutral-50 rounded-xl text-center text-xs text-gray-400 italic">
                    {selectedItem.userId === profile.uid ? 'Esta peça pertence a você' : 'Peça indisponível para venda'}
                  </div>
                )}

                {/* Delete Closet Item Button for Owner */}
                {selectedItem.userId === profile.uid && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {isConfirmingDeleteCloset ? (
                      <div className="bg-red-50 p-3.5 rounded-2xl border border-red-100 space-y-3 text-center">
                        <p className="text-[11px] text-red-800 font-medium leading-relaxed">
                          Tem certeza de que deseja apagar essa peça do seu armário?
                        </p>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleDeleteClosetItem(selectedItem.id)}
                            disabled={isDeletingCloset}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {isDeletingCloset ? 'Excluindo...' : 'Sim, Apagar'}
                          </button>
                          <button
                            onClick={() => setIsConfirmingDeleteCloset(false)}
                            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-gray-50 transition cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsConfirmingDeleteCloset(true)}
                        className="w-full bg-red-50 text-red-600 border border-red-100 py-3 rounded-2xl text-xs font-bold hover:bg-red-100/80 hover:text-red-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Trash className="w-4 h-4" />
                        <span>Apagar Peça do Armário</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SIMULATED PURCHASE / CHECKOUT POPUP */}
        <AnimatePresence>
          {checkoutItem && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[60] flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 text-xs text-left shadow-2xl relative"
              >
                {checkoutSuccess ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 animate-fadeIn">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-emerald-600 stroke-[3px]" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-base text-gray-900">Pedido Solicitado!</h4>
                      <p className="text-gray-500 text-[11px] mt-1.5 leading-relaxed">
                        Sua proposta de compra de <strong>{checkoutItem.name}</strong> foi enviada para {checkoutSeller}! O vendedor entrará em contato via WhatsApp.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <div>
                        <h4 className="font-display font-extrabold text-sm text-gray-900">Finalizar Compra</h4>
                        <span className="text-[10px] text-gray-400">Vendedor: {checkoutSeller}</span>
                      </div>
                      <button onClick={() => setCheckoutItem(null)} className="text-gray-400 hover:text-black"><X className="w-4 h-4" /></button>
                    </div>

                    <div className="bg-neutral-50 p-3 rounded-2xl border border-gray-100 flex items-center space-x-3">
                      <img src={checkoutItem.image} className="w-11 h-11 rounded-lg object-cover" alt="item checkout" />
                      <div>
                        <p className="font-bold text-gray-800">{checkoutItem.name}</p>
                        <span className="text-[10px] font-mono text-gray-400 block mt-0.5">{checkoutItem.brand} • R$ {checkoutItem.price}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Seu Nome Completo</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Michel Cacho" 
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className="w-full bg-neutral-50 p-2.5 rounded-xl outline-none border border-gray-200 focus:border-black text-xs transition"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Seu Celular / WhatsApp</label>
                        <input 
                          type="text" 
                          placeholder="Ex: (51) 99999-9999" 
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          className="w-full bg-neutral-50 p-2.5 rounded-xl outline-none border border-gray-200 focus:border-black text-xs transition"
                        />
                      </div>

                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-[10px] text-emerald-800 leading-normal">
                        <strong>Simulação Segura:</strong> Ao clicar abaixo, um aviso de compra fictício será gerado na sua caixa de notificações!
                      </div>
                    </div>

                    <button 
                      onClick={handlePurchase}
                      disabled={!buyerName || !buyerPhone}
                      className="w-full bg-black text-white py-3.5 rounded-2xl text-xs font-bold hover:bg-neutral-800 disabled:opacity-40 transition cursor-pointer"
                    >
                      Solicitar Compra (R$ {checkoutItem.price})
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SETTINGS MENU OVERLAY MODAL */}
        <AnimatePresence>
          {showSettingsMenu && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[65] flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4 text-xs text-left shadow-2xl relative"
              >
                <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                  <h4 className="font-sans font-extrabold text-sm text-gray-900">Ajustes da Conta</h4>
                  <button onClick={() => setShowSettingsMenu(false)} className="text-gray-400 hover:text-black cursor-pointer"><X className="w-4 h-4" /></button>
                </div>

                <div className="space-y-2 pt-1">
                  <button 
                    onClick={async () => {
                      setShowSettingsMenu(false);
                      const newBio = prompt('Escreva sua nova bio:', profile.bio);
                      if (newBio !== null) {
                        const updated = { ...profile, bio: newBio };
                        setProfile(updated);
                        await setDoc(doc(db, 'users', profile.uid), updated);
                      }
                    }}
                    className="w-full text-left bg-neutral-50 hover:bg-neutral-100 p-3.5 rounded-2xl border border-gray-100 text-xs font-semibold text-gray-700 transition flex items-center justify-between cursor-pointer"
                  >
                    <span>Editar Biografia</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button 
                    onClick={async () => {
                      setShowSettingsMenu(false);
                      const newLoc = prompt('Digite sua localização (Cidade, País):', profile.location);
                      if (newLoc !== null) {
                        const updated = { ...profile, location: newLoc };
                        setProfile(updated);
                        await setDoc(doc(db, 'users', profile.uid), updated);
                      }
                    }}
                    className="w-full text-left bg-neutral-50 hover:bg-neutral-100 p-3.5 rounded-2xl border border-gray-100 text-xs font-semibold text-gray-700 transition flex items-center justify-between cursor-pointer"
                  >
                    <span>Alterar Localização</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button 
                    onClick={() => {
                      setShowSettingsMenu(false);
                      handleLogout();
                    }}
                    className="w-full text-left bg-red-50 hover:bg-red-100 p-3.5 rounded-2xl border border-red-100 text-xs font-semibold text-red-600 transition flex items-center justify-between cursor-pointer"
                  >
                    <span>Sair da Conta (Logout)</span>
                    <ChevronRight className="w-4 h-4 text-red-300" />
                  </button>
                </div>

                <button 
                  onClick={() => setShowSettingsMenu(false)}
                  className="w-full bg-black text-white py-3 rounded-2xl text-xs font-bold hover:bg-neutral-800 transition cursor-pointer"
                >
                  Fechar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}
