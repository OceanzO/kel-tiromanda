// ==========================================
// Supabase Database Types
// ==========================================

export interface PopulationStats {
  id: string;
  total_penduduk: number | null;
  kepala_keluarga: number | null;
  luas_wilayah: string | null;
  lingkungan: number;
  jumlah_rt: number;
  mata_pencaharian: string | null;
  updated_at: string;
}

export interface GenderComposition {
  id: string;
  laki_laki: number | null;
  perempuan: number | null;
  updated_at: string;
}

export interface Official {
  id: string;
  name: string;
  position_id: string;
  position_en: string;
  phone: string;
  photo_url: string;
  type: 'lurah' | 'staff';
  display_order: number;
  created_at: string;
}

export interface Neighborhood {
  id: string;
  name_id: string;
  name_en: string;
  head_name: string;
  head_phone: string;
  display_order: number;
  created_at: string;
}

export interface NeighborhoodRT {
  id: string;
  neighborhood_id: string;
  name: string;
  position: string;
  phone: string;
  created_at: string;
}

export interface Potential {
  id: string;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  icon: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Facility {
  id: string;
  name_id: string;
  name_en: string;
  description_id: string;
  description_en: string;
  location: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Infographic {
  id: string;
  title: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  category: string;
  caption_id: string;
  caption_en: string;
  display_order: number;
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  date: string;
  image_url: string;
  created_at: string;
}
