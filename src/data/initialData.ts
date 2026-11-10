import { Category, Product, Coupon, Order } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Gold Coin', slug: 'gold-coin', icon: 'Coins', description: 'Moedas de ouro para negociar, pagar hunts e alavancar seu poder' },
  { id: 2, name: 'Tibia Coin', slug: 'tibia-coin', icon: 'Gem', description: 'Moedas transferíveis da Store Oficial e Koliseu com entrega ultra rápida' },
  { id: 3, name: 'Sets', slug: 'sets', icon: 'Shield', description: 'Armaduras level 3k , 5k e 8k completas para Knight, Paladin, Sorcerer e Druid' },
  { id: 4, name: 'Relíquias', slug: 'relikias', icon: 'Crown', description: 'Relikias de buff de dano e buff ' },
  { id: 5, name: 'Gemas', slug: 'gemas', icon: 'Sparkles', description: 'Gemas' },
  { id: 6, name: 'Badges de Skills', slug: 'badges-de-skills', icon: 'Award', description: 'Badges que aumentam o dano das habilidades' },
  { id: 7, name: 'Upgrade Tier', slug: 'upgrade-tier', icon: 'ArrowUpCircle', description: 'Tier 10 pra dar buff nos itens' },
  { id: 8, name: 'Minerais', slug: 'minerais', icon: 'Box', description: 'Minerais utilizados pra craft de itens' }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Tibia Coins
  {
    id: 1,
    categoryId: 2,
    name: '1.000 Tibia Coins ',
    slug: '1000-tibia-coins',
    description: '1000 Tibia Coins transferíveis para qualquer servidor do Koliseu OT. Entrega automática em até 3 minutos.',
    price: 39.90,
    stock: 8500,
    isFeatured: true,
    rarity: 'Épico',
    deliveryType: 'Instantâneo',
    unit: '100 TC',
    imageUrl: 'https://i.postimg.cc/pXWqq3Lx/NNct-Cm-Umnf-Sk-MDtg-Bu-Ru4er-Hq6df532x-Q5Azc-U7Bjo70g-hwbo-Br-Ks-Xgw1i-Ck2i9bstd77zpr-KHHAro-Wy-LGr.jpg'
  },
  {
    id: 2,
    categoryId: 2,
    name: '5.000 Tibia Coins ',
    slug: '5000-tibia-coins',
    description: 'tibia Coins transferíveis para qualquer servidor do Koliseu OT. Entrega automática em até 3 minutos .',
    price: 199.90,
    stock: 4200,
    isFeatured: true,
    rarity: 'Lendário',
    deliveryType: 'Instantâneo',
    unit: '5000 TC',
    imageUrl: 'https://i.postimg.cc/pXWqq3Lx/NNct-Cm-Umnf-Sk-MDtg-Bu-Ru4er-Hq6df532x-Q5Azc-U7Bjo70g-hwbo-Br-Ks-Xgw1i-Ck2i9bstd77zpr-KHHAro-Wy-LGr.jpg'
  },
  {
    id: 3,
    categoryId: 2,
    name: '10.000 Tibia Coins ',
    slug: '10.000-tibia-coins',
    description: 'tibia Coins transferíveis para qualquer servidor do Koliseu OT. Entrega automática em até 3 minutos .',
    price: 399.00,
    stock: 950,
    isFeatured: true,
    rarity: 'Mítico',
    deliveryType: 'Instantâneo',
    unit: '10000 TC',
    imageUrl: 'https://i.postimg.cc/pXWqq3Lx/NNct-Cm-Umnf-Sk-MDtg-Bu-Ru4er-Hq6df532x-Q5Azc-U7Bjo70g-hwbo-Br-Ks-Xgw1i-Ck2i9bstd77zpr-KHHAro-Wy-LGr.jpg'
  },

  // Gold Coins
  {
    id: 4,
    categoryId: 1,
    name: '1 TRILHAO DE Gold Coins ',
    slug: '1 TRILHAO DE Gold Coins',
    description: 'Dez milhões em moedas de ouro transferidas via banco seguro ou parcel para qualquer cidade.',
    price: 0.90,
    stock: 12000,
    isFeatured: true,
    rarity: 'Raro',
    deliveryType: 'Até 5 min',
    unit: '10kk',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 5,
    categoryId: 1,
    name: '50 TRILHOES DE Gold Coins ',
    slug: '50 TRILHOES DE Gold Coins',
    description: 'Cinquenta milhões de gold coins para bancar suprimentos, runas e equipamentos de ponta.',
    price: 45.00,
    stock: 4500,
    isFeatured: false,
    rarity: 'Épico',
    deliveryType: 'Até 5 min',
    unit: '50kk',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 6,
    categoryId: 1,
    name: '100 TRILHOES DE Gold Coins ',
    slug: '100 TRILHOES DE Gold Coins',
    description: 'Pacote corporativo para guildas e guerras. 200kk entregues de forma fracionada ou integral.',
    price: 90.00,
    stock: 1800,
    isFeatured: true,
    rarity: 'Lendário',
    deliveryType: 'Até 5 min',
    unit: '200kk',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&auto=format&fit=crop&q=80'
  },

  // Sets
  {
    id: 7,
    categoryId: 3,
    name: 'SETS LEVEL 3K',
    slug: 'TODAS AS VOCAÇOES',
    description: 'TODAS AS VOCAÇOES',
    price: 20.00,
    stock: 5,
    isFeatured: true,
    rarity: 'Lendário',
    deliveryType: 'Até 5 min',
    unit: 'Full Set',
    imageUrl: 'https://i.postimg.cc/Kv74vsPR/SET-ED.png'
  },
  {
    id: 8,
    categoryId: 3,
    name: 'SETS LEVEL 5K',
    slug: 'TODAS AS VOCAÇOES',
    description: 'TODAS AS VOCAÇOES',
    price: 50.00,
    stock: 3,
    isFeatured: true,
    rarity: 'Mítico',
    deliveryType: 'Até 5 min',
    unit: 'Arma + Set',
    imageUrl: 'https://i.postimg.cc/wxLj0bbP/SET-5K.png'
  },
  {
    id: 9,
    categoryId: 3,
    name: 'SETS LEVEL 8K',
    slug: 'TODAS AS VOCAÇOES',
    description: 'TODAS AS VOCAÇOES',
    price: 90.00,
    stock: 8,
    isFeatured: false,
    rarity: 'Épico',
    deliveryType: 'Até 5 min',
    unit: 'Full Set',
    imageUrl: 'https://i.postimg.cc/9MXYJ7cN/SET-MS.png'
  },

  // Relíquias
  {
    id: 10,
    categoryId: 4,
    name: 'RELIKIAS LENDARIAS T10',
    slug: 'RELIKIAS DE BUFF',
    description: 'TODAS AS VOCAÇOES',
    price: 15.00,
    stock: 644,
    isFeatured: true,
    rarity: 'Lendário',
    deliveryType: 'Até 5 min',
    unit: 'Artefato',
    imageUrl: 'https://i.postimg.cc/nz7pSCTG/RELIKIA-BUFF.png'
  },
  {
    id: 11,
    categoryId: 4,
    name: 'RELIKIAS LENDARIAS T10',
    slug: 'RELIKIAS DE ATK',
    description: 'TODAS AS VOCAÇOES',
    price: 15.00,
    stock: 444,
    isFeatured: false,
    rarity: 'Mítico',
    deliveryType: 'Até 5 min',
    unit: 'Artefato',
    imageUrl: 'https://i.postimg.cc/Gp4cYMyx/RELIKIA-ATK.png'
  },

  // Gemas
  {
    id: 12,
    categoryId: 5,
    name: 'GEMAS TIER 1',
    slug: 'TODOS OS BUFF',
    description: '',
    price: 0.01,
    stock: 2544,
    isFeatured: false,
    rarity: 'Épico',
    deliveryType: 'Instantâneo',
    unit: 'Pack 3x',
    imageUrl: 'https://i.postimg.cc/1txZFyP4/gem-tier.png'
  },
  {
    id: 13,
    categoryId: 5,
    name: 'GEMAS TIER 1',
    slug: 'TODOS OS BUFF',
    description: '',
    price: 0.01,
    stock: 4044,
    isFeatured: false,
    rarity: 'Raro',
    deliveryType: 'Instantâneo',
    unit: 'Unidade',
    imageUrl: 'https://i.postimg.cc/1txZFyP4/gem-tier.png'
  },

  // Badges de Skills
  {
    id: 14,
    categoryId: 6,
    name: 'BADGES DE RP',
    slug: 'BADGES DE RP',
    description: 'BADGES DE RP.',
    price: 0.50,
    stock: 124444,
    isFeatured: true,
    rarity: 'Lendário',
    deliveryType: 'Até 5 min',
    unit: 'Medalha',
    imageUrl: 'https://i.postimg.cc/NjShhQKC/ADGES-RP.png'
  },
  {
    id: 15,
    categoryId: 6,
    name: 'BADGES DE SKILL EK , MS , ED',
    slug: 'BADGES DE SKILL EK , MS , ED',
    description: 'BADGES DE SKILL EK , MS , ED.',
    price: 0.30,
    stock: 1445,
    isFeatured: false,
    rarity: 'Épico',
    deliveryType: 'Até 5 min',
    unit: 'Medalha',
    imageUrl: 'https://i.postimg.cc/h4rHDLXH/ADGES-RP.png'
  },

  // Upgrade Tier
  {
    id: 16,
    categoryId: 7,
    name: 'TIER 10',
    slug: 'TIER 10',
    description: 'TIER 10.',
    price: 5.00,
    stock: 744,
    isFeatured: true,
    rarity: 'Mítico',
    deliveryType: 'Até 5 min',
    unit: 'Núcleo',
    imageUrl: 'https://i.postimg.cc/tTzmgb4W/TIER-10.png'
  },
  {
    id: 17,
    categoryId: 7,
    name: 'SKILL +10',
    slug: 'SKILL +10',
    description: 'SKILL+10',
    price: 5.00,
    stock: 3440,
    isFeatured: false,
    rarity: 'Raro',
    deliveryType: 'Até 5 min',
    unit: 'Pack 5x',
    imageUrl: 'https://i.postimg.cc/9088GBTR/SKILL-10.png'
  },

  // Minerais
  {
    id: 18,
    categoryId: 8,
    name: 'MINERAIS DE RP E EK',
    slug: 'DO BASICO AO EPICO',
    description: '',
    price: 0.10,
    stock: 9044,
    isFeatured: false,
    rarity: 'Raro',
    deliveryType: 'Instantâneo',
    unit: '100x',
    imageUrl: 'https://i.postimg.cc/xC9thZ3H/mineral.png'
  },
  {
    id: 19,
    categoryId: 8,
    name: 'MINERAIS DE ED E MS',
    slug: 'DO BASICO AO EPICO',
    description: '.',
    price: 0.10,
    stock: 14440,
    isFeatured: false,
    rarity: 'Comum',
    deliveryType: 'Instantâneo',
    unit: '50x',
    imageUrl: 'https://i.postimg.cc/xC9thZ3H/mineral.png'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 1,
    code: 'CAPANE10',
    discountType: 'percentage',
    discountValue: 10,
    usesLeft: 98,
    minOrderValue: 50
  },
  {
    id: 2,
    code: 'KOLISEU15',
    discountType: 'fixed',
    discountValue: 15,
    usesLeft: 47,
    minOrderValue: 100
  },
  {
    id: 3,
    code: 'DRAGON5',
    discountType: 'percentage',
    discountValue: 5,
    usesLeft: 200,
    minOrderValue: 20
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 1042,
    userId: 1,
    userEmail: 'lord.warrior@koliseu.com',
    userName: 'Lord Warrior',
    characterName: 'Capane Knight',
    serverName: 'Koliseu OT (Midgard)',
    subtotal: 189.90,
    discountAmount: 18.99,
    couponCode: 'CAPANE10',
    totalAmount: 170.91,
    status: 'Entregue',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    whatsappUrl: 'https://api.whatsapp.com/send/?phone=5561999287524&text&type=phone_number&app_absent=0' + encodeURIComponent('Pedido #1042 - Capane Knight (Koliseu OT)') + '&type=phone_number&app_absent=0',
    items: [
      {
        id: 1,
        orderId: 1042,
        productId: 2,
        productName: '1.000 Tibia Coins (Pacote Ouro)',
        productPrice: 189.90,
        quantity: 1,
        unitPrice: 189.90
      }
    ]
  },
  {
    id: 1043,
    userId: 2,
    userEmail: 'mage.supremo@gmail.com',
    userName: 'Mage Supremo',
    characterName: 'Eldritch Druid',
    serverName: 'Global (Antica)',
    subtotal: 35.00,
    discountAmount: 0,
    totalAmount: 35.00,
    status: 'Pagamento confirmado',
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    whatsappUrl: 'https://api.whatsapp.com/send/?phone=5561999287524&text&type=phone_number&app_absent=0' + encodeURIComponent('Pedido #1043 - Eldritch Druid (Global Antica)') + '&type=phone_number&app_absent=0',
    items: [
      {
        id: 2,
        orderId: 1043,
        productId: 4,
        productName: '10kk Gold Coins (10.000.000 gps)',
        productPrice: 35.00,
        quantity: 1,
        unitPrice: 35.00
      }
    ]
  }
];
