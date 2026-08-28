# 🏛️ Kelurahan Tiromanda — Portal Digital Resmi

<div align="center">
  <img src="public/logo-kkn-unhas.png" alt="Logo KKN Unhas Gel. 116" width="150" />
</div>

<p align="center">
  <strong>Portal Informasi dan Layanan Publik Digital Kelurahan Tiromanda, Makale Selatan, Tana Toraja.</strong><br>
  <em>Dikembangkan oleh Tim KKN Tematik Universitas Hasanuddin Gel. 116</em>
</p>

<p align="center">
  <a href="#-fitur-utama">Fitur Utama</a> •
  <a href="#-teknologi-yang-digunakan">Teknologi</a> •
  <a href="#-panduan-instalasi-getting-started">Instalasi</a> •
  <a href="#-struktur-proyek">Struktur Proyek</a>
</p>

---

## 🌟 Tentang Proyek

Website resmi Kelurahan Tiromanda dibangun untuk meningkatkan transparansi informasi, memudahkan pelayanan publik, dan memperkenalkan potensi desa kepada masyarakat luas. Dibangun menggunakan teknologi web modern untuk menjamin kecepatan, keamanan, dan pengalaman pengguna yang responsif serta interaktif.

## ✨ Fitur Utama

- **🌍 Portal Publik:** Menampilkan profil kelurahan, visi misi, dan informasi publik lainnya secara elegan.
- **📰 Berita & Pengumuman:** Sistem publikasi berita desa yang dinamis untuk masyarakat.
- **🔐 Sistem Autentikasi Admin:** Keamanan login terjamin menggunakan Supabase Auth untuk pengelola situs.
- **🎛️ Dashboard CMS:** Panel admin khusus (Content Management System) untuk mengelola data, berita, dan aset visual dengan mudah.
- **🖼️ Galeri Interaktif:** Dukungan carousel gambar (*Swiper*) dan penampil mode penuh (*Lightbox*) untuk galeri kegiatan yang interaktif.
- **⚡ SEO & Performa Unggulan:** Optimasi Server-Side Rendering (SSR) dari Next.js, metadata dinamis, serta konfigurasi sitemap/robots.txt bawaan.
- **🌐 Internasionalisasi (i18n):** Arsitektur dasar yang mendukung multi-bahasa.
- **📱 Desain Responsif:** Tampilan yang menyesuaikan sempurna baik di layar *desktop*, tablet, maupun *smartphone* berkat Tailwind CSS.

## 🛠️ Teknologi yang Digunakan

Proyek ini dikembangkan dengan *tech stack* mutakhir:

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
- **Bahasa Pemrograman:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animasi & Interaksi UI:** [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Backend, Auth, & Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Library Pendukung:**
  - `axios` untuk *fetching* data tambahan.
  - `swiper` & `yet-another-react-lightbox` untuk UI/UX media visual.
  - `react-icons` untuk koleksi ikon modern.
  - `heic2any` & `sharp` untuk optimasi pemrosesan gambar berkinerja tinggi.

## 🚀 Panduan Instalasi (Getting Started)

Ikuti langkah-langkah berikut untuk menjalankan proyek secara lokal di lingkungan *development*:

### 1. Prasyarat
Pastikan Anda telah menginstal **Node.js** (versi 20 atau lebih baru) dan *package manager* bawaannya (`npm`).

### 2. Kloning Repositori
```bash
git clone https://github.com/yourusername/kel-tiromanda.git
cd kel-tiromanda/frontend
```

### 3. Instalasi Dependensi
Jalankan perintah ini untuk menginstal seluruh modul yang dibutuhkan:
```bash
npm install
```

### 4. Konfigurasi Lingkungan (Environment Variables)
Proyek ini membutuhkan variabel lingkungan dari Supabase. Buat file `.env.local` di *root* direktori `frontend/` dan tambahkan kredensial berikut:
```env
NEXT_PUBLIC_SUPABASE_URL=url_project_supabase_anda
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_key_project_supabase_anda
```
*(Catatan: Anda dapat menggunakan script `supabase-migration.sql` yang tersedia untuk menerapkan skema tabel langsung di dashboard Supabase Anda).*

### 5. Menjalankan Server Lokal
Mulai *development server* dengan perintah:
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya. Proyek akan diperbarui secara otomatis setiap Anda mengubah kode.

## 📂 Struktur Proyek

```text
frontend/
├── public/                # Aset statis (gambar, favicon, logo)
└── src/
    ├── app/               # Rute aplikasi utama (Next.js App Router)
    │   ├── admin/         # Dashboard & pengelolaan CMS
    │   ├── api/           # Endpoint API internal
    │   ├── auth/          # Rute autentikasi
    │   ├── berita/        # Tampilan artikel & berita
    │   ├── login/         # Halaman masuk admin
    │   └── update-password/ # Pembaruan kata sandi
    ├── components/        # Komponen React yang dapat digunakan kembali (UI, Layout)
    ├── context/           # React Context (State Management)
    ├── i18n/              # Konfigurasi multi-bahasa
    └── lib/               # Skrip utilitas, konfigurasi lib (Supabase client, dll.)
```

---

<p align="center">
  Dibuat dengan ❤️ untuk <strong>Kelurahan Tiromanda, Makale Selatan</strong>.
</p>
