import { Look, ClosetItem, UserProfile, AppNotification, AestheticCategory } from './types';

export const SEED_PROFILE: UserProfile = {
  uid: 'rickzinxx',
  username: 'rickzinxx',
  displayName: 'Rick',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  bio: 'Explorando novas formas de ver a moda. Menos é mais.',
  location: 'Porto Alegre, Brazil',
  followersCount: 142,
  followingCount: 1,
  auraScore: 13,
  totalOutfits: 12,
  instagram: 'rickzinxx',
  whatsapp: '+5551999999999'
};

export const SEED_OTHER_USERS: UserProfile[] = [
  {
    uid: 'thiithisan',
    username: 'thiithisan..',
    displayName: 'Thais',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    bio: 'streetwear & archives.',
    location: 'São Paulo, Brazil',
    followersCount: 890,
    followingCount: 412,
    auraScore: 84,
    totalOutfits: 42
  },
  {
    uid: 'beanascime',
    username: 'beanascime..',
    displayName: 'Beatriz',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    bio: 'Apenas montando composições minimalistas',
    location: 'Rio de Janeiro, Brazil',
    followersCount: 520,
    followingCount: 231,
    auraScore: 56,
    totalOutfits: 18
  },
  {
    uid: 'mihcacho',
    username: 'mihcacho',
    displayName: 'Michel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    bio: 'Moda minimalista masculina, peças atemporais.',
    location: 'Curitiba, Brazil',
    followersCount: 1205,
    followingCount: 450,
    auraScore: 234,
    totalOutfits: 64
  },
  {
    uid: 'bfr',
    username: 'bfr',
    displayName: 'Bruno',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    bio: 'Aura and aesthetics.',
    location: 'Belo Horizonte, Brazil',
    followersCount: 312,
    followingCount: 120,
    auraScore: 19,
    totalOutfits: 9
  },
  {
    uid: 'li1',
    username: 'li1',
    displayName: 'Aline',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    bio: 'Coisas pretas e brancas.',
    location: 'Porto Alegre, Brazil',
    followersCount: 452,
    followingCount: 198,
    auraScore: 78,
    totalOutfits: 21
  }
];

export const SEED_CLOSET: ClosetItem[] = [
  {
    id: 'c1',
    userId: 'rickzinxx',
    name: 'Jeans Baggy Lavagem Clara',
    category: 'Jeans',
    brand: 'Zara',
    price: 199.00,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400',
    forSale: true,
    isNew: true,
    boughtAt: '2026-06-10',
    timesWorn: 8,
    costPerWear: 24.87
  },
  {
    id: 'c2',
    userId: 'rickzinxx',
    name: 'Jaqueta de Couro Preta',
    category: 'Jaqueta',
    brand: 'H&M',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400',
    forSale: true,
    isNew: false,
    boughtAt: '2026-01-15',
    timesWorn: 18,
    costPerWear: 25.00
  },
  {
    id: 'c3',
    userId: 'rickzinxx',
    name: 'Camiseta Preta Gola Careca',
    category: 'Camiseta',
    brand: 'Cloz Basic',
    price: 79.00,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400',
    forSale: false,
    isNew: false,
    boughtAt: '2025-11-20',
    timesWorn: 32,
    costPerWear: 2.46
  },
  {
    id: 'c4',
    userId: 'rickzinxx',
    name: 'Moletom Preto Suede',
    category: 'Outros',
    brand: 'Arezzo',
    price: 220.00,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400',
    forSale: true,
    isNew: false,
    boughtAt: '2026-05-02',
    timesWorn: 5,
    costPerWear: 44.00
  },
  {
    id: 'c5',
    userId: 'thiithisan',
    name: 'Tênis Samba Og Core Black',
    category: 'Sapato',
    brand: 'Adidas',
    price: 599.90,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=400',
    forSale: false,
    boughtAt: '2026-03-01',
    timesWorn: 45,
    costPerWear: 13.33
  },
  {
    id: 'c6',
    userId: 'bfr',
    name: 'Óculos Retrô Grafite',
    category: 'Acessório',
    brand: 'Mercedes-Benz',
    price: 890.00,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400',
    forSale: true,
    boughtAt: '2026-04-12',
    timesWorn: 14,
    costPerWear: 63.57
  }
];

export const SEED_LOOKS: Look[] = [
  {
    id: 'l1',
    userId: 'mihcacho',
    username: 'mihcacho',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800',
    title: 'Arquitetura Moderna em Grafite Suave',
    description: 'Composição de alfaiataria cinza estruturada com base preta e acessórios de pérolas.',
    tags: [
      { id: 't1_1', name: 'Blazer Alfaiataria Cinza', brand: 'Zara', price: 349.00, forSale: true, category: 'Jaqueta', x: 50, y: 35 },
      { id: 't1_2', name: 'Calça Ampla Pregas', brand: 'Studio No.', price: 280.00, forSale: true, category: 'Jeans', x: 52, y: 70 },
      { id: 't1_3', name: 'Bolsa Carteira Couro', brand: 'Prada', price: 4200.00, forSale: false, category: 'Acessório', x: 38, y: 65 }
    ],
    likes: 80,
    likedBy: [],
    views: 342,
    auraScore: 80,
    date: '2026-07-16',
    commentsCount: 2,
    location: 'São Paulo, Brazil',
    aesthetics: ['Acubi', 'Brutalismo']
  },
  {
    id: 'l2',
    userId: 'thiithisan',
    username: 'thiithisan..',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&q=80&w=800',
    title: 'Camiseta Básica e Calça Xadrez',
    description: 'Estilo grunge sutil para uma selfie descontraída no banheiro.',
    tags: [
      { id: 't2_1', name: 'Camiseta Oversized Bolso', brand: 'Cloz', price: 89.00, forSale: true, category: 'Camiseta', x: 45, y: 40 },
      { id: 't2_2', name: 'Calça Xadrez Escura', brand: 'H&M', price: 159.00, forSale: false, category: 'Jeans', x: 48, y: 75 }
    ],
    likes: 34,
    likedBy: [],
    views: 198,
    auraScore: 34,
    date: '2026-07-15',
    commentsCount: 1,
    location: 'Rio de Janeiro, Brazil',
    aesthetics: ['Cottagecore', 'Acubi']
  },
  {
    id: 'l3',
    userId: 'beanascime',
    username: 'beanascime..',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    title: 'Jaqueta Corta Vento e Óculos Vintage',
    description: 'Uma selfie no elevador com casaco da Adidas.',
    tags: [
      { id: 't3_1', name: 'Corta Vento Esportivo', brand: 'Adidas', price: 299.00, forSale: true, category: 'Jaqueta', x: 55, y: 45 }
    ],
    likes: 12,
    likedBy: [],
    views: 84,
    auraScore: 12,
    date: '2026-07-14',
    commentsCount: 0,
    location: 'Porto Alegre, Brazil',
    aesthetics: ['Athleisure', 'Amekaji']
  },
  {
    id: 'l4',
    userId: 'li1',
    username: 'li1',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800',
    title: 'Camisa Aberta e Jeans Baggy',
    description: 'Estética clássica de outono, combinando tons frios e óculos pretos.',
    tags: [
      { id: 't4_1', name: 'Camisa Linho Branca', brand: 'Zara', price: 189.00, forSale: true, category: 'Camiseta', x: 48, y: 35 },
      { id: 't4_2', name: 'Sobretudo Preto Lã', brand: 'Cloz', price: 650.00, forSale: true, category: 'Jaqueta', x: 50, y: 50 },
      { id: 't4_3', name: 'Jeans Amplo Lavagem Média', brand: 'Levi\'s', price: 349.00, forSale: false, category: 'Jeans', x: 50, y: 75 }
    ],
    likes: 68,
    likedBy: [],
    views: 290,
    auraScore: 68,
    date: '2026-07-13',
    commentsCount: 3,
    location: 'Belo Horizonte, Brazil',
    aesthetics: ['Bauhaus', 'Brutalismo']
  },
  {
    id: 'l5',
    userId: 'bfr',
    username: 'bfr',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    title: 'Estilo Streetwear com Boné Mercedes',
    description: 'Outfit urbano minimalista, jaqueta de sarja clara e boné clássico.',
    tags: [
      { id: 't5_1', name: 'Jaqueta Sarja Clara', brand: 'Mercedes-Benz', price: 320.00, forSale: true, category: 'Jaqueta', x: 52, y: 40 },
      { id: 't5_2', name: 'Boné Mercedes Racing', brand: 'Mercedes-Benz', price: 120.00, forSale: false, category: 'Acessório', x: 51, y: 20 },
      { id: 't5_3', name: 'Calça Cargo Sarja Ampla', brand: 'Studio No.', price: 210.00, forSale: true, category: 'Jeans', x: 53, y: 70 }
    ],
    likes: 4,
    likedBy: [],
    views: 45,
    auraScore: 4,
    date: '2026-07-12',
    commentsCount: 1,
    location: 'São Paulo, Brazil',
    aesthetics: ['Amekaji', 'Athleisure']
  },
  {
    id: 'l6',
    userId: 'rickzinxx',
    username: 'rickzinxx',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    title: 'Casual Classy outfiting',
    description: 'Sobretudo preto, calça jeans lavagem clara e moletom.',
    tags: [
      { id: 't6_1', name: 'Jeans Baggy Lavagem Clara', brand: 'Zara', price: 199.00, forSale: true, category: 'Jeans', x: 49, y: 72 },
      { id: 't6_2', name: 'Jaqueta de Couro Preta', brand: 'H&M', price: 450.00, forSale: true, category: 'Jaqueta', x: 50, y: 45 }
    ],
    likes: 12,
    likedBy: [],
    views: 74,
    auraScore: 12,
    date: '2026-07-16',
    commentsCount: 2,
    location: 'Porto Alegre, Brazil',
    aesthetics: ['Acubi', 'Bauhaus']
  }
];

export const SEED_AESTHETICS: AestheticCategory[] = [
  { id: 'ae1', name: 'Acubi', count: '55,3 mil', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=300' },
  { id: 'ae2', name: 'Amekaji', count: '7,9 mil', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300' },
  { id: 'ae3', name: 'Androginia', count: '14,8 mil', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=300' },
  { id: 'ae4', name: 'Athleisure', count: '10,8 mil', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300' },
  { id: 'ae5', name: 'Barroco', count: '1,2 mil', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=300' },
  { id: 'ae6', name: 'Bauhaus', count: '1,1 mil', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300' },
  { id: 'ae7', name: 'Boho', count: '15,3 mil', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=300' },
  { id: 'ae8', name: 'Brutalismo', count: '1,2 mil', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=300' },
  { id: 'ae9', name: 'Coquette', count: '16 mil', image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&q=80&w=300' },
  { id: 'ae10', name: 'Cottagecore', count: '7 mil', image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&q=80&w=300' },
  { id: 'ae11', name: 'Fibonacci', count: '329', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300' },
  { id: 'ae12', name: 'Gamine', count: '4,6 mil', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' }
];

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'like',
    fromUser: { username: 'm4rber', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
    title: 'm4rber, enrik e mais 2',
    subtitle: 'curtiu sua composição!',
    lookImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=150',
    auraAdded: 4,
    timestamp: '1m atrás'
  },
  {
    id: 'n2',
    type: 'like',
    fromUser: { username: 'm4rber', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
    title: 'm4rber, sashawqq e mais 1',
    subtitle: 'curtiu sua composição!',
    lookImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=150',
    auraAdded: 3,
    timestamp: '8m atrás'
  },
  {
    id: 'n3',
    type: 'follow',
    fromUser: { username: 'enrik', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150' },
    title: 'enrik',
    subtitle: 'começou a seguir você',
    auraAdded: 2,
    timestamp: '1h atrás'
  },
  {
    id: 'n4',
    type: 'comment',
    fromUser: { username: 'sashawqq', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' },
    title: 'sashawqq',
    subtitle: 'comentou: "Estética absurda, amei as tags!"',
    lookImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=150',
    timestamp: '4h atrás'
  }
];

export const FREQUENT_QUESTIONS_CLOZ = [
  {
    q: 'O que é um calendário de looks?',
    a: 'O calendário de looks é uma forma visual de documentar o que você veste dia após dia. Cada quadrado na sua grade mensal representa o look usado naquele dia, ajudando a criar consciência sobre o seu estilo e uso real do seu armário.'
  },
  {
    q: 'O que é um "lookbook"? Como o Cloz funciona?',
    a: 'Um lookbook é uma coleção de fotos de looks. O Cloz é um lookbook global anônimo por padrão. Você tira fotos do seu look diário, e nosso sistema ajuda a remover o seu rosto para manter o foco total na roupa e na expressão estética.'
  },
  {
    q: 'Preciso compartilhar meu calendário?',
    a: 'Não necessariamente. Seu armário digital e calendário podem ser configurados como totalmente privados para uso estritamente pessoal, ou públicos caso queira compartilhar, influenciar e vender suas peças para outros membros.'
  },
  {
    q: 'Como isso difere do Pinterest ou Instagram?',
    a: 'Ao contrário do Instagram, não há rostos, julgamentos, ou pressões de popularidade. O Cloz foca no minimalismo, no anonimato (se desejar), no calendário de uso real das roupas (com "custo por uso") e na capacidade de colocar suas roupas à venda diretamente nas tags do look.'
  },
  {
    q: 'É grátis?',
    a: 'Sim, o Cloz é totalmente gratuito para criar seu calendário, gerenciar seu armário digital de até 100 peças e interagir com a comunidade. Oferecemos opções premium para armários ilimitados e ferramentas avançadas de e-commerce.'
  }
];

export const FREQUENT_QUESTIONS_CLOSET = [
  {
    q: 'Existe algum app de armário digital gratuito?',
    a: 'Sim, o Cloz oferece um plano gratuito vitalício para você fotografar, catalogar e gerenciar suas roupas de forma super intuitiva.'
  },
  {
    q: 'Qual a diferença entre o Cloz e o Alta?',
    a: 'O Cloz foca no minimalismo, no anonimato e na simplicidade da catalogação (com IA para identificar as peças a partir de uma única foto de look completo), além de ter um ecossistema integrado para venda das suas peças usadas.'
  },
  {
    q: 'Tenho que fotografar cada item um por um?',
    a: 'Não! Esse é o diferencial do Cloz. Você pode simplesmente subir uma foto sua vestindo o look completo. Nosso sistema de visão computacional segmenta e cadastra os itens automaticamente: calça, camisa, jaqueta e sapatos.'
  },
  {
    q: 'Um armário digital ajuda a parar de gastar demais?',
    a: 'Com certeza. Ao ver exatamente o que você possui e calcular o "Custo por Uso" de cada peça, você passa a investir em roupas de melhor qualidade e evita comprar itens repetidos ou parecidos.'
  },
  {
    q: 'Armário digital é o mesmo que calendário de looks?',
    a: 'Não. O Armário Digital é o inventário de todas as suas roupas individuais. O Calendário de Looks é o registro de quais peças você vestiu em cada dia do mês.'
  },
  {
    q: 'Posso compartilhar meu armário com amigos?',
    a: 'Sim! Você pode compartilhar o link do seu armário ou colocá-lo no modo público para que amigos vejam suas peças e possam até fazer propostas de compra.'
  }
];
