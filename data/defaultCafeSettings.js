export const defaultCafeSettings = {
  brand: {
    title: 'Cafe Project',
    subtitle: 'Hoş geldiniz',
    coverImage:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=500&fit=crop',
  },
  theme: {
    accent: '#c45c26',
    background: '#f7f3ee',
    surface: '#ffffff',
  },
  social: {
    instagram: 'https://instagram.com',
    twitter: 'https://x.com',
    whatsapp: 'https://wa.me',
    location: 'https://maps.google.com',
  },
  drinks: [
    {
      id: 'cay',
      name: 'Çay',
      price: 25,
      image:
        'https://images.unsplash.com/photo-1597318181409-c90f7f7f3c68?w=400&h=400&fit=crop',
      fallbackImage:
        'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop',
    },
    {
      id: 'turk-kahvesi',
      name: 'Türk Kahvesi',
      price: 60,
      image:
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      fallbackImage:
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop',
    },
    {
      id: 'latte',
      name: 'Latte',
      price: 85,
      image:
        'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=400&fit=crop',
      fallbackImage:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    },
    {
      id: 'americano',
      name: 'Americano',
      price: 75,
      image:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop',
      fallbackImage:
        'https://images.unsplash.com/photo-1517701550927-30cf4d1ef43b?w=400&h=400&fit=crop',
    },
    {
      id: 'limonata',
      name: 'Limonata',
      price: 70,
      image:
        'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop',
      fallbackImage:
        'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
    },
    {
      id: 'ayran',
      name: 'Ayran',
      price: 35,
      image:
        'https://images.unsplash.com/photo-1623065426882-62b1cad29549?w=400&h=400&fit=crop',
      fallbackImage:
        'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop',
    },
  ],
  menuCategories: {
    nargileler: [
      {
        id: 'elma-nane',
        name: 'Elma Nane Nargile',
        price: 290,
        image:
          'https://images.unsplash.com/photo-1566740933430-b5e70b06d2d5?w=600&h=400&fit=crop',
        contents: [
          'Elma aroması',
          'Nane aroması',
          'Buzlu marpuç',
          'Meyve başlık',
        ],
      },
      {
        id: 'cifte-elma',
        name: 'Çifte Elma Nargile',
        price: 280,
        image:
          'https://images.unsplash.com/photo-1515442261605-65987783cb6a?w=600&h=400&fit=crop',
        contents: ['Çifte elma tütünü', 'Özel kömür', 'Soğutmalı başlık'],
      },
      {
        id: 'karpuz-cilek',
        name: 'Karpuz Çilek Nargile',
        price: 310,
        image:
          'https://images.unsplash.com/photo-1520625515031-58553f0f7869?w=600&h=400&fit=crop',
        contents: ['Karpuz aroması', 'Çilek aroması', 'Hafif mentol dokunuşu'],
      },
    ],
    icecekler: [
      {
        id: 'cay-menu',
        name: 'Demlik Çay',
        price: 80,
        image:
          'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=400&fit=crop',
        contents: ['Taze demlenmiş çay', 'Limon dilimi', '2 ince belli bardak'],
      },
      {
        id: 'mojito',
        name: 'Mojito (Mocktail)',
        price: 140,
        image:
          'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&h=400&fit=crop',
        contents: ['Nane', 'Lime', 'Soda', 'Esmer şeker'],
      },
      {
        id: 'cold-brew',
        name: 'Cold Brew',
        price: 120,
        image:
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop',
        contents: ['12 saat demleme kahve', 'Buz', 'Şurup opsiyonu'],
      },
    ],
    yiyecekler: [
      {
        id: 'karisik-tost',
        name: 'Karışık Tost',
        price: 120,
        image:
          'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop',
        contents: [
          'Tam buğday ekmeği',
          'Kaşar peyniri',
          'Sucuk',
          'Domates & salatalık',
          'Tereyağı',
        ],
      },
      {
        id: 'menemen',
        name: 'Menemen',
        price: 140,
        image:
          'https://images.unsplash.com/photo-1588137378633-dea9c581ec09?w=600&h=400&fit=crop',
        contents: [
          'Taze yumurta',
          'Domates & biber',
          'Beyaz peynir',
          'Zeytinyağı',
          'Baharatlı ekmek',
        ],
      },
      {
        id: 'kofte-tabagi',
        name: 'Köfte Tabağı',
        price: 220,
        image:
          'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&h=400&fit=crop',
        contents: [
          'Izgara köfte (6 adet)',
          'Pilav',
          'Közlenmiş biber',
          'Domates',
          'Yoğurt sos',
        ],
      },
      {
        id: 'tavuk-sandvic',
        name: 'Tavuk Sandviç',
        price: 165,
        image:
          'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop',
        contents: [
          'Izgara tavuk göğsü',
          'Marul & turşu',
          'Özel sos',
          'Ciabatta ekmek',
        ],
      },
      {
        id: 'cheesecake',
        name: 'Cheesecake',
        price: 110,
        image:
          'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&h=400&fit=crop',
        contents: [
          'Krem peynirli taban',
          'Orman meyveli sos',
          'Taze çilek',
          'Vanilyalı krema',
        ],
      },
      {
        id: 'salata',
        name: 'Akdeniz Salatası',
        price: 130,
        image:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
        contents: [
          'Roka & marul',
          'Cherry domates',
          'Salatalık',
          'Zeytin & feta',
          'Limon-nar ekşi sos',
        ],
      },
    ],
  },
  services: [
    {
      id: 'vale',
      label: 'Vale',
      status: 'hizmetimiz bulunmaktadır',
      iconType: 'vale',
    },
    {
      id: 'aile-salonu',
      label: 'Aile Salonu',
      status: 'Var',
      iconType: 'aile',
    },
    {
      id: 'cocuk-alani',
      label: 'Çocuk Alanı',
      status: 'Var',
      iconType: 'cocuk',
    },
    {
      id: 'okey-salonu',
      label: 'Okey Salonu',
      status: 'Var',
      iconType: 'okey',
    },
    { id: 'otopark', label: 'Otopark', status: 'Yok', iconType: 'otopark' },
  ],
  tableZones: [
    {
      id: 'salon',
      label: 'Salon',
      count: 14,
      prefix: '',
      usePrefix: false,
    },
    {
      id: 'teras',
      label: 'Teras',
      count: 4,
      prefix: 'Teras',
      usePrefix: true,
    },
    {
      id: 'bahce',
      label: 'Bahçe',
      count: 4,
      prefix: 'Bahçe',
      usePrefix: true,
    },
    {
      id: 'vip',
      label: 'VIP',
      count: 2,
      prefix: 'VIP',
      usePrefix: true,
    },
  ],
  tables: [
    { id: 'salon-1', label: '1', zone: 'salon', zoneLabel: 'Salon', number: 1, status: 'neutral', shadow: 'a' },
    { id: 'salon-2', label: '2', zone: 'salon', zoneLabel: 'Salon', number: 2, status: 'success', shadow: 'b' },
    { id: 'salon-3', label: '3', zone: 'salon', zoneLabel: 'Salon', number: 3, status: 'neutral', shadow: 'c' },
    { id: 'salon-4', label: '4', zone: 'salon', zoneLabel: 'Salon', number: 4, status: 'danger', shadow: 'd' },
    { id: 'salon-5', label: '5', zone: 'salon', zoneLabel: 'Salon', number: 5, status: 'neutral', shadow: 'e' },
    { id: 'salon-6', label: '6', zone: 'salon', zoneLabel: 'Salon', number: 6, status: 'success', shadow: 'f' },
    { id: 'salon-7', label: '7', zone: 'salon', zoneLabel: 'Salon', number: 7, status: 'neutral', shadow: 'a' },
    { id: 'salon-8', label: '8', zone: 'salon', zoneLabel: 'Salon', number: 8, status: 'danger', shadow: 'b' },
    { id: 'salon-9', label: '9', zone: 'salon', zoneLabel: 'Salon', number: 9, status: 'neutral', shadow: 'c' },
    { id: 'salon-10', label: '10', zone: 'salon', zoneLabel: 'Salon', number: 10, status: 'success', shadow: 'd' },
    { id: 'salon-11', label: '11', zone: 'salon', zoneLabel: 'Salon', number: 11, status: 'neutral', shadow: 'e' },
    { id: 'salon-12', label: '12', zone: 'salon', zoneLabel: 'Salon', number: 12, status: 'neutral', shadow: 'f' },
    { id: 'salon-13', label: '13', zone: 'salon', zoneLabel: 'Salon', number: 13, status: 'success', shadow: 'a' },
    { id: 'salon-14', label: '14', zone: 'salon', zoneLabel: 'Salon', number: 14, status: 'danger', shadow: 'b' },
    { id: 'teras-1', label: 'Teras-1', zone: 'teras', zoneLabel: 'Teras', number: 1, status: 'success', shadow: 'c' },
    { id: 'teras-2', label: 'Teras-2', zone: 'teras', zoneLabel: 'Teras', number: 2, status: 'success', shadow: 'd' },
    { id: 'teras-3', label: 'Teras-3', zone: 'teras', zoneLabel: 'Teras', number: 3, status: 'neutral', shadow: 'e' },
    { id: 'teras-4', label: 'Teras-4', zone: 'teras', zoneLabel: 'Teras', number: 4, status: 'neutral', shadow: 'f' },
    { id: 'bahce-1', label: 'Bahçe-1', zone: 'bahce', zoneLabel: 'Bahçe', number: 1, status: 'neutral', shadow: 'a' },
    { id: 'bahce-2', label: 'Bahçe-2', zone: 'bahce', zoneLabel: 'Bahçe', number: 2, status: 'danger', shadow: 'b' },
    { id: 'bahce-3', label: 'Bahçe-3', zone: 'bahce', zoneLabel: 'Bahçe', number: 3, status: 'neutral', shadow: 'c' },
    { id: 'bahce-4', label: 'Bahçe-4', zone: 'bahce', zoneLabel: 'Bahçe', number: 4, status: 'danger', shadow: 'd' },
    { id: 'vip-1', label: 'VIP-1', zone: 'vip', zoneLabel: 'VIP', number: 1, status: 'danger', shadow: 'e' },
    { id: 'vip-2', label: 'VIP-2', zone: 'vip', zoneLabel: 'VIP', number: 2, status: 'success', shadow: 'f' },
  ],
  geofence: {
    enabled: false,
    polygon: [],
    mapCenter: { lat: 41.0082, lng: 28.9784 },
    mapZoom: 16,
    lastSearch: '',
    toleranceMeters: 120,
  },
  nfc: {
    enabled: true,
    sessionDurationMinutes: 90,
  },
}
