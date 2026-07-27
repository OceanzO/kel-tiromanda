// ==========================================
// Navigation Items
// ==========================================
export type NavChild = { id: string; label_id: string; label_en: string; href: string };
export type NavItem = {
  id: string;
  label_id: string;
  label_en: string;
  href: string;
  children?: NavChild[];
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'home',       label_id: 'Beranda',   label_en: 'Home',       href: '#home' },
  { id: 'about',      label_id: 'Tentang',   label_en: 'About',      href: '#about' },
  { id: 'government', label_id: 'Struktur',  label_en: 'Structure',  href: '#government' },
  {
    id: 'potentials',
    label_id: 'Potensi',
    label_en: 'Potentials',
    href: '#potentials',
    children: [
      { id: 'potentials', label_id: 'Potensi Desa', label_en: 'Village Potentials', href: '#potentials' },
      { id: 'umkm',       label_id: 'UMKM',          label_en: 'UMKM',               href: '#umkm' },
    ],
  },
  { id: 'facilities', label_id: 'Fasilitas', label_en: 'Facilities', href: '#facilities' },
  {
    id: 'infografis',
    label_id: 'Infografis',
    label_en: 'Infographics',
    href: '#gallery',
    children: [
      { id: 'location', label_id: 'Lokasi', label_en: 'Location', href: '#location' },
      { id: 'gallery',  label_id: 'Galeri', label_en: 'Gallery',  href: '#gallery'  },
      { id: 'news',     label_id: 'Berita', label_en: 'News',     href: '#news'     },
    ],
  },
];

// ==========================================
// Hero Slides
// ==========================================
export const HERO_SLIDES = [
  {
    image: '/images/hero/hero_panorama.png',
    alt: 'Panorama Kelurahan Tiromanda',
  },
  {
    image: '/images/hero/hero_tongkonan.png',
    alt: 'Tongkonan Traditional House',
  },
  {
    image: '/images/hero/hero_ricefields.png',
    alt: 'Terraced Rice Fields',
  },
  {
    image: '/images/hero/hero_mountains.png',
    alt: 'Mountain Landscape',
  },
  {
    image: '/images/hero/hero_community.png',
    alt: 'Community Activities',
  },
  {
    image: '/images/hero/hero_aerial.png',
    alt: 'Aerial Drone View',
  },
];

// ==========================================
// About Data
// ==========================================
export const ABOUT_DATA = {
  profile_id: 'Kelurahan Tiromanda adalah salah satu kelurahan yang terletak di Kecamatan Makale Selatan, Kabupaten Tana Toraja, Provinsi Sulawesi Selatan. Kelurahan ini memiliki keindahan alam yang menakjubkan, warisan budaya Toraja yang kaya, serta masyarakat yang ramah dan gotong royong. Tiromanda dikelilingi oleh perbukitan hijau, sawah berteras, dan pemandangan alam yang memukau.',
  profile_en: 'Kelurahan Tiromanda is a village located in Makale Selatan District, Tana Toraja Regency, South Sulawesi Province. This village has stunning natural beauty, rich Toraja cultural heritage, and a warm, cooperative community. Tiromanda is surrounded by green hills, terraced rice fields, and breathtaking natural scenery.',
  video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  vision_id: 'Mewujudkan Kelurahan Tiromanda sebagai kelurahan yang maju, mandiri, dan berdaya saing, dengan tetap menjaga kelestarian budaya dan kearifan lokal Toraja.',
  vision_en: 'To realize Kelurahan Tiromanda as an advanced, independent, and competitive village while preserving Toraja cultural heritage and local wisdom.',
  mission_id: [
    'Meningkatkan kualitas pelayanan publik kepada masyarakat',
    'Mengembangkan potensi wisata dan ekonomi kreatif',
    'Melestarikan budaya dan kearifan lokal Toraja',
    'Meningkatkan kualitas infrastruktur dan fasilitas umum',
    'Memberdayakan masyarakat melalui program-program pembangunan',
  ],
  mission_en: [
    'Improve the quality of public services for the community',
    'Develop tourism potential and creative economy',
    'Preserve Toraja culture and local wisdom',
    'Improve the quality of infrastructure and public facilities',
    'Empower the community through development programs',
  ],
  area: '5.2 km²',
  population: '3,450',
  geography_id: 'Terletak di dataran tinggi dengan ketinggian 700-900 mdpl, dikelilingi oleh perbukitan dan pegunungan, beriklim tropis sejuk.',
  geography_en: 'Located in the highlands at an altitude of 700-900 meters above sea level, surrounded by hills and mountains, with a cool tropical climate.',
};

// ==========================================
// Officials Data
// ==========================================
export const OFFICIALS = {
  lurah: {
    name: 'Drs. Yohanis Palimbong',
    position_id: 'Lurah Tiromanda',
    position_en: 'Village Head of Tiromanda',
    phone: '+62 812-3456-7890',
    photo: '/images/officials/lurah.png',
  },
  staff: [
    {
      name: 'Martha Limbong, S.Sos',
      position_id: 'Sekretaris Lurah',
      position_en: 'Secretary',
      phone: '+62 813-4567-8901',
      photo: '/images/officials/sekretaris.png',
    },
    {
      name: 'Petrus Tandibua, S.E.',
      position_id: 'Kasi Sosial & Budaya',
      position_en: 'Head of Social & Cultural Affairs',
      phone: '+62 814-5678-9012',
      photo: '/images/officials/kasi_sosial.png',
    },
    {
      name: 'Daniel Parinding, S.IP.',
      position_id: 'Kasi Pemerintahan',
      position_en: 'Head of Government Affairs',
      phone: '+62 815-6789-0123',
      photo: '/images/officials/kasi_pemerintahan.png',
    },
    {
      name: 'Samuel Rantebua, S.T.',
      position_id: 'Kasi Perhubungan',
      position_en: 'Head of Transportation Affairs',
      phone: '+62 816-7890-1234',
      photo: '/images/officials/kasi_perhubungan.png',
    },
  ],
  neighborhoods: [
    {
      name_id: 'Lingkungan Bulaan',
      name_en: 'Bulaan Neighborhood',
      head: { name: 'Markus Sareong', phone: '+62 821-1111-0001' },
      rts: [
        { name: 'Thomas Salu', position: 'RT 1', phone: '+62 822-1111-0001' },
        { name: 'Agustinus Pata\'', position: 'RT 2', phone: '+62 822-1111-0002' },
      ],
    },
    {
      name_id: 'Lingkungan Pasa\' Buntu',
      name_en: 'Pasa\' Buntu Neighborhood',
      head: { name: 'Yohanes Mangnga\'', phone: '+62 821-2222-0001' },
      rts: [
        { name: 'Paulus Karaeng', position: 'RT 1', phone: '+62 822-2222-0001' },
        { name: 'Lukas Parinding', position: 'RT 2', phone: '+62 822-2222-0002' },
      ],
    },
    {
      name_id: 'Lingkungan Rante Po\'pong',
      name_en: 'Rante Po\'pong Neighborhood',
      head: { name: 'Stefanus Lamba\'', phone: '+62 821-3333-0001' },
      rts: [
        { name: 'Martinus Bua\'', position: 'RT 1', phone: '+62 822-3333-0001' },
        { name: 'Benediktus Toding', position: 'RT 2', phone: '+62 822-3333-0002' },
      ],
    },
    {
      name_id: 'Lingkungan Bau',
      name_en: 'Bau Neighborhood',
      head: { name: 'Aleksander Minggu', phone: '+62 821-4444-0001' },
      rts: [
        { name: 'Kristofer Rante', position: 'RT 1', phone: '+62 822-4444-0001' },
        { name: 'Dominikus Sando', position: 'RT 2', phone: '+62 822-4444-0002' },
      ],
    },
  ],
};

// ==========================================
// Potentials Data
// ==========================================
export const POTENTIALS = [
  {
    title_id: 'Pariwisata',
    title_en: 'Tourism',
    description_id: 'Pemandangan alam yang memukau, situs budaya Toraja, dan keindahan alam yang menjadi daya tarik wisatawan.',
    description_en: 'Stunning natural scenery, Toraja cultural sites, and beautiful landscapes that attract tourists.',
    icon: 'FaMapMarkedAlt',
    image: '/images/potentials/tourism.png',
  },
  {
    title_id: 'Pertanian',
    title_en: 'Agriculture',
    description_id: 'Sawah berteras yang menghasilkan padi berkualitas tinggi serta berbagai jenis sayuran dan buah-buahan.',
    description_en: 'Terraced rice fields producing high-quality rice along with various types of vegetables and fruits.',
    icon: 'FaSeedling',
    image: '/images/potentials/agriculture.png',
  },
  {
    title_id: 'Perkebunan Kopi',
    title_en: 'Coffee Plantation',
    description_id: 'Kopi Toraja yang terkenal di mancanegara dengan cita rasa khas dataran tinggi Sulawesi.',
    description_en: 'World-renowned Toraja coffee with its distinctive highland Sulawesi flavor profile.',
    icon: 'FaCoffee',
    image: '/images/potentials/coffee.png',
  },
  {
    title_id: 'Peternakan',
    title_en: 'Livestock',
    description_id: 'Peternakan kerbau yang memiliki nilai budaya tinggi serta peternakan babi dan ayam kampung.',
    description_en: 'Buffalo farming with high cultural value, as well as pig and free-range chicken farming.',
    icon: 'GiBuffaloHead',
    image: '/images/potentials/livestock.png',
  },
  {
    title_id: 'Budaya',
    title_en: 'Culture',
    description_id: 'Warisan budaya Toraja yang kaya termasuk upacara adat, tarian tradisional, dan arsitektur Tongkonan.',
    description_en: 'Rich Toraja cultural heritage including traditional ceremonies, dances, and Tongkonan architecture.',
    icon: 'FaTheaterMasks',
    image: '/images/potentials/culture.png',
  },
  {
    title_id: 'Kerajinan Lokal',
    title_en: 'Local Crafts',
    description_id: 'Kerajinan tangan khas Toraja seperti ukiran kayu, tenun tradisional, dan anyaman bambu.',
    description_en: 'Toraja handicrafts including wood carving, traditional weaving, and bamboo crafts.',
    icon: 'FaPalette',
    image: '/images/potentials/crafts.png',
  },
  {
    title_id: 'Kuliner',
    title_en: 'Culinary',
    description_id: 'Kuliner khas Toraja seperti Pa\'piong, Ballo, dan berbagai masakan tradisional yang menggugah selera.',
    description_en: 'Toraja cuisine including Pa\'piong, Ballo, and various traditional dishes with unique flavors.',
    icon: 'FaUtensils',
    image: '/images/potentials/culinary.png',
  },
  {
    title_id: 'Sumber Daya Alam',
    title_en: 'Natural Resources',
    description_id: 'Kekayaan alam berupa hutan lindung, sumber air bersih, dan keindahan alam yang masih terjaga.',
    description_en: 'Natural resources including protected forests, clean water sources, and well-preserved natural beauty.',
    icon: 'FaMountain',
    image: '/images/potentials/nature.png',
  },
];

// ==========================================
// Facilities Data
// ==========================================
export const FACILITIES = [
  {
    name_id: 'Kantor Kelurahan',
    name_en: 'Village Office',
    description_id: 'Kantor pelayanan administrasi kelurahan Tiromanda.',
    description_en: 'Administrative services office of Tiromanda village.',
    location: 'Jl. Poros Makale-Sangalla',
    image: '/images/facilities/office.png',
  },
  {
    name_id: 'Kantor Kecamatan',
    name_en: 'District Office',
    description_id: 'Kantor Kecamatan Makale Selatan.',
    description_en: 'South Makale District Office.',
    location: 'Jl. Poros Makale',
    image: '/images/facilities/district.png',
  },
  {
    name_id: 'Sekolah Dasar',
    name_en: 'Elementary School',
    description_id: 'SDN Tiromanda — sekolah dasar negeri yang melayani pendidikan anak-anak di kelurahan.',
    description_en: 'SDN Tiromanda — public elementary school serving children in the village.',
    location: 'Lingkungan Bulaan',
    image: '/images/facilities/school.png',
  },
  {
    name_id: 'Gereja',
    name_en: 'Church',
    description_id: 'Gereja yang menjadi tempat ibadah utama masyarakat Tiromanda.',
    description_en: 'The main place of worship for the Tiromanda community.',
    location: 'Lingkungan Pasa\' Buntu',
    image: '/images/facilities/church.png',
  },
  {
    name_id: 'Masjid',
    name_en: 'Mosque',
    description_id: 'Masjid yang melayani umat Muslim di kelurahan Tiromanda.',
    description_en: 'Mosque serving the Muslim community in Tiromanda village.',
    location: 'Lingkungan Rante Po\'pong',
    image: '/images/facilities/mosque.png',
  },
  {
    name_id: 'Puskesmas',
    name_en: 'Health Center',
    description_id: 'Puskesmas pembantu yang memberikan pelayanan kesehatan dasar.',
    description_en: 'Auxiliary health center providing basic health services.',
    location: 'Jl. Poros Makale-Sangalla',
    image: '/images/facilities/health.png',
  },
  {
    name_id: 'Lapangan Olahraga',
    name_en: 'Sports Field',
    description_id: 'Lapangan olahraga serbaguna untuk kegiatan masyarakat.',
    description_en: 'Multi-purpose sports field for community activities.',
    location: 'Lingkungan Bulaan',
    image: '/images/facilities/sports.png',
  },
  {
    name_id: 'Balai Pertemuan',
    name_en: 'Community Hall',
    description_id: 'Balai pertemuan untuk kegiatan musyawarah dan acara kemasyarakatan.',
    description_en: 'Meeting hall for deliberations and community events.',
    location: 'Lingkungan Pasa\' Buntu',
    image: '/images/facilities/hall.png',
  },
  {
    name_id: 'Pemakaman Umum',
    name_en: 'Public Cemetery',
    description_id: 'Area pemakaman umum yang dikelola oleh kelurahan.',
    description_en: 'Public cemetery area managed by the village.',
    location: 'Lingkungan Bau',
    image: '/images/facilities/cemetery.png',
  },
  {
    name_id: 'Pasar',
    name_en: 'Market',
    description_id: 'Pasar tradisional tempat masyarakat bertransaksi hasil bumi dan kebutuhan sehari-hari.',
    description_en: 'Traditional market where the community trades agricultural products and daily necessities.',
    location: 'Lingkungan Pasa\' Buntu',
    image: '/images/facilities/market.png',
  },
];

// ==========================================
// UMKM Products Data
// ==========================================
export const UMKM_PRODUCTS = [
  {
    name_id: 'Kopi Toraja',
    name_en: 'Toraja Coffee',
    description_id: 'Kopi arabika premium dari dataran tinggi Tana Toraja dengan cita rasa khas yang mendunia.',
    description_en: 'Premium arabica coffee from the highlands of Tana Toraja with a world-renowned distinctive taste.',
    contact: '+62 812-3456-7890',
    image: '/images/umkm/coffee.png',
  },
  {
    name_id: 'Jajanan Lokal',
    name_en: 'Local Snacks',
    description_id: 'Berbagai jajanan tradisional khas Toraja seperti duku-duku, onde-onde, dan kue cucur.',
    description_en: 'Various traditional Toraja snacks including duku-duku, onde-onde, and cucur cake.',
    contact: '+62 813-4567-8901',
    image: '/images/umkm/snacks.png',
  },
  {
    name_id: 'Kerajinan Tradisional',
    name_en: 'Traditional Handicrafts',
    description_id: 'Kerajinan tangan khas Toraja berupa ukiran kayu, miniatur Tongkonan, dan tenun tradisional.',
    description_en: 'Toraja handicrafts including wood carvings, Tongkonan miniatures, and traditional weavings.',
    contact: '+62 814-5678-9012',
    image: '/images/umkm/handicrafts.png',
  },
  {
    name_id: 'Hasil Pertanian',
    name_en: 'Agricultural Products',
    description_id: 'Beras organik, sayuran segar, dan buah-buahan dari kebun masyarakat Tiromanda.',
    description_en: 'Organic rice, fresh vegetables, and fruits from Tiromanda community gardens.',
    contact: '+62 815-6789-0123',
    image: '/images/umkm/agriculture.png',
  },
  {
    name_id: 'Makanan Lokal',
    name_en: 'Local Food',
    description_id: 'Masakan khas Toraja seperti Pa\'piong babi, ayam kampung, dan sambal rica-rica.',
    description_en: 'Toraja cuisine such as Pa\'piong pork, free-range chicken, and rica-rica chili sauce.',
    contact: '+62 816-7890-1234',
    image: '/images/umkm/food.png',
  },
];

// ==========================================
// Gallery Data
// ==========================================
export const GALLERY_IMAGES = [
  { src: '/images/hero/hero_panorama.png', category: 'tourism', caption_id: 'Panorama Kelurahan Tiromanda', caption_en: 'Tiromanda Village Panorama' },
  { src: '/images/hero/hero_tongkonan.png', category: 'cultural', caption_id: 'Tongkonan — Rumah Adat Toraja', caption_en: 'Tongkonan — Traditional Toraja House' },
  { src: '/images/hero/hero_ricefields.png', category: 'tourism', caption_id: 'Sawah Berteras di Tiromanda', caption_en: 'Terraced Rice Fields in Tiromanda' },
  { src: '/images/hero/hero_mountains.png', category: 'tourism', caption_id: 'Pemandangan Pegunungan', caption_en: 'Mountain Landscape' },
  { src: '/images/hero/hero_community.png', category: 'community', caption_id: 'Kegiatan Masyarakat', caption_en: 'Community Activities' },
  { src: '/images/hero/hero_aerial.png', category: 'tourism', caption_id: 'Pemandangan Udara Desa', caption_en: 'Aerial Village View' },
  { src: '/images/hero/hero_panorama.png', category: 'kkn', caption_id: 'Kegiatan KKN di Kelurahan', caption_en: 'KKN Activities in the Village' },
  { src: '/images/hero/hero_community.png', category: 'events', caption_id: 'Acara Kemasyarakatan', caption_en: 'Community Events' },
  { src: '/images/hero/hero_tongkonan.png', category: 'cultural', caption_id: 'Warisan Budaya Toraja', caption_en: 'Toraja Cultural Heritage' },
  { src: '/images/hero/hero_aerial.png', category: 'facilities', caption_id: 'Fasilitas Kelurahan', caption_en: 'Village Facilities' },
  { src: '/images/hero/hero_ricefields.png', category: 'community', caption_id: 'Gotong Royong', caption_en: 'Community Cooperation' },
  { src: '/images/hero/hero_mountains.png', category: 'tourism', caption_id: 'Keindahan Alam Tiromanda', caption_en: 'Tiromanda Natural Beauty' },
];

export const GALLERY_CATEGORIES = [
  { id: 'all', label_id: 'Semua', label_en: 'All' },
  { id: 'kkn', label_id: 'Kegiatan KKN', label_en: 'KKN Activities' },
  { id: 'community', label_id: 'Kegiatan Masyarakat', label_en: 'Community Activities' },
  { id: 'events', label_id: 'Acara Desa', label_en: 'Village Events' },
  { id: 'tourism', label_id: 'Wisata', label_en: 'Tourism' },
  { id: 'cultural', label_id: 'Budaya', label_en: 'Cultural' },
  { id: 'facilities', label_id: 'Fasilitas', label_en: 'Facilities' },
];

// ==========================================
// Contact Data
// ==========================================
export const CONTACTS = [
  {
    type: 'whatsapp',
    label_id: 'WhatsApp',
    label_en: 'WhatsApp',
    value: '+62 812-3456-7890',
    url: 'https://wa.me/6281234567890',
    icon: 'FaWhatsapp',
  },
  {
    type: 'phone',
    label_id: 'Telepon',
    label_en: 'Phone',
    value: '+62 423-xxxx-xxx',
    url: 'tel:+62423xxxxxxx',
    icon: 'FaPhone',
  },
  {
    type: 'email',
    label_id: 'Email',
    label_en: 'Email',
    value: 'kelurahan.tiromanda@gmail.com',
    url: 'mailto:kelurahan.tiromanda@gmail.com',
    icon: 'FaEnvelope',
  },
  {
    type: 'instagram',
    label_id: 'Instagram',
    label_en: 'Instagram',
    value: '@kel.tiromanda',
    url: 'https://instagram.com/kel.tiromanda',
    icon: 'FaInstagram',
  },
  {
    type: 'tiktok',
    label_id: 'TikTok',
    label_en: 'TikTok',
    value: '@kel.tiromanda',
    url: 'https://tiktok.com/@kel.tiromanda',
    icon: 'FaTiktok',
  },
  {
    type: 'youtube',
    label_id: 'YouTube',
    label_en: 'YouTube',
    value: 'Kelurahan Tiromanda',
    url: 'https://youtube.com/@keltiromanda',
    icon: 'FaYoutube',
  },
];

// ==========================================
// Location Data
// ==========================================
export const LOCATION = {
  address_id: 'Kelurahan Tiromanda, Kecamatan Makale Selatan, Kabupaten Tana Toraja, Sulawesi Selatan, Indonesia',
  address_en: 'Kelurahan Tiromanda, Makale Selatan District, Tana Toraja Regency, South Sulawesi, Indonesia',
  office_hours_id: 'Senin - Jumat: 08:00 - 16:00 WITA',
  office_hours_en: 'Monday - Friday: 08:00 AM - 04:00 PM WITA',
  maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15926.256!2d119.8453!3d-3.1234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMDcnMjQuMyJTIDExOcKwNTAnNDMuMSJF!5e0!3m2!1sid!2sid!4v1234567890',
  maps_url: 'https://www.google.com/maps/place/Tiromanda,+Makale+Selatan,+Tana+Toraja',
  directions_url: 'https://www.google.com/maps/dir//Tiromanda,+Makale+Selatan,+Tana+Toraja',
  lat: -3.1234,
  lng: 119.8453,
};
