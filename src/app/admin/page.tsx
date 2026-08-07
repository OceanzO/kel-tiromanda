'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  FaUsers, FaUserTie, FaMountain, FaBuilding,
  FaImages, FaNewspaper, FaChartBar, FaVenusMars,
  FaArrowRight, FaLayerGroup, FaHome, FaCheckCircle,
} from 'react-icons/fa';

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatsData {
  total_penduduk: number | null;
  laki_laki: number | null;
  perempuan: number | null;
  officialsCount: number;
  potentialsCount: number;
  facilitiesCount: number;
  galleryCount: number;
  newsCount: number;
}

// ─── Quick Action Card ────────────────────────────────────────────────────────
function QuickAction({
  href,
  icon: Icon,
  label,
  desc,
  color,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  desc: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 p-5 rounded-2xl bg-card-bg border border-foreground/6 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${color}`}
      >
        <Icon className="text-lg" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-foreground mb-0.5">{label}</p>
        <p className="text-xs text-foreground-muted leading-relaxed">{desc}</p>
      </div>
      <FaArrowRight className="text-xs text-foreground-muted/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 mt-1 shrink-0" />
    </Link>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
  bgClass,
  loading,
}: {
  label: string;
  value: number | string | null;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  loading: boolean;
}) {
  return (
    <div className="premium-card p-5">
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 bg-foreground/10 rounded" />
            <div className="w-10 h-10 bg-foreground/10 rounded-xl" />
          </div>
          <div className="h-7 w-14 bg-foreground/10 rounded" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider">
              {label}
            </span>
            <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center`}>
              <Icon className="text-base" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {value === null || value === undefined
              ? '—'
              : typeof value === 'number'
              ? value.toLocaleString('id-ID')
              : value}
          </p>
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData>({
    total_penduduk: null,
    laki_laki: null,
    perempuan: null,
    officialsCount: 0,
    potentialsCount: 0,
    facilitiesCount: 0,
    galleryCount: 0,
    newsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email ?? null);
    });

    const fetchStats = async () => {
      try {
        const [
          { count: officialsCount },
          { count: potentialsCount },
          { count: facilitiesCount },
          { count: galleryCount },
          { count: newsCount },
          { data: popData },
          { data: genderData },
        ] = await Promise.all([
          supabase.from('officials').select('*', { count: 'exact', head: true }),
          supabase.from('potentials').select('*', { count: 'exact', head: true }),
          supabase.from('facilities').select('*', { count: 'exact', head: true }),
          supabase.from('gallery').select('*', { count: 'exact', head: true }),
          supabase.from('news').select('*', { count: 'exact', head: true }),
          supabase.from('population_stats').select('total_penduduk').limit(1).single(),
          supabase.from('gender_composition').select('laki_laki, perempuan').limit(1).single(),
        ]);

        setStats({
          total_penduduk: popData?.total_penduduk ?? null,
          laki_laki: genderData?.laki_laki ?? null,
          perempuan: genderData?.perempuan ?? null,
          officialsCount: officialsCount ?? 0,
          potentialsCount: potentialsCount ?? 0,
          facilitiesCount: facilitiesCount ?? 0,
          galleryCount: galleryCount ?? 0,
          newsCount: newsCount ?? 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = userEmail ? userEmail.split('@')[0] : 'Admin';
  const timeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat Pagi';
    if (h < 15) return 'Selamat Siang';
    if (h < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <div className="space-y-8 max-w-6xl">

      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl p-7 md:p-9"
        style={{ background: 'linear-gradient(135deg, #1F3A2C 0%, #2d5a3f 60%, #1a3a2a 100%)' }}
      >
        <div className="absolute inset-0 section-pattern opacity-10" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 right-1/3 w-40 h-40 bg-emerald-300/10 rounded-full blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-amber-400/70 text-sm font-medium mb-1">
              {timeGreeting()}, {firstName} 👋
            </p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
              Dashboard Admin
            </h2>
            <p className="text-white/50 text-sm max-w-md">
              Kelola seluruh konten website Kelurahan Tiromanda dari sini.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-white text-sm font-medium transition-all"
            >
              <FaHome className="text-xs" /> Lihat Website
            </Link>
          </div>
        </div>
      </div>

      {/* ── Population Summary Bar ──────────────────────────────────────────── */}
      {!loading && (stats.total_penduduk || stats.laki_laki || stats.perempuan) && (
        <div
          className="rounded-2xl p-5 md:p-6 grid grid-cols-3 gap-4 text-center border"
          style={{ background: 'linear-gradient(135deg, rgba(91,127,94,0.08) 0%, rgba(227,167,58,0.06) 100%)', borderColor: 'rgba(227,167,58,0.15)' }}
        >
          {[
            { label: 'Total Penduduk', value: stats.total_penduduk, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Laki-laki', value: stats.laki_laki, color: 'text-sky-600 dark:text-sky-400' },
            { label: 'Perempuan', value: stats.perempuan, color: 'text-pink-600 dark:text-pink-400' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className={`text-2xl md:text-3xl font-bold ${color}`}>
                {value !== null ? value.toLocaleString('id-ID') : '—'}
              </p>
              <p className="text-xs text-foreground-muted mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Stats Grid ─────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-base text-foreground">Ringkasan Data</h3>
          <span className="text-xs text-foreground-muted">
            {loading ? 'Memuat...' : 'Data terkini'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Perangkat', value: stats.officialsCount, icon: FaUserTie, colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500/10' },
            { label: 'Potensi', value: stats.potentialsCount, icon: FaMountain, colorClass: 'text-amber-500', bgClass: 'bg-amber-500/10' },
            { label: 'Fasilitas', value: stats.facilitiesCount, icon: FaBuilding, colorClass: 'text-violet-500', bgClass: 'bg-violet-500/10' },
            { label: 'Galeri Foto', value: stats.galleryCount, icon: FaImages, colorClass: 'text-rose-500', bgClass: 'bg-rose-500/10' },
            { label: 'Berita', value: stats.newsCount, icon: FaNewspaper, colorClass: 'text-teal-500', bgClass: 'bg-teal-500/10' },
          ].map((card) => (
            <StatCard key={card.label} {...card} loading={loading} />
          ))}
        </div>
      </div>

      {/* ── Quick Actions ───────────────────────────────────────────────────── */}
      <div>
        <h3 className="font-heading font-bold text-base text-foreground mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickAction
            href="/admin/statistik"
            icon={FaChartBar}
            label="Update Statistik Penduduk"
            desc="Perbarui data jumlah penduduk, KK, dan wilayah."
            color="bg-blue-500/10 text-blue-500"
          />
          <QuickAction
            href="/admin/gender"
            icon={FaVenusMars}
            label="Komposisi Gender"
            desc="Atur data laki-laki dan perempuan."
            color="bg-pink-500/10 text-pink-500"
          />
          <QuickAction
            href="/admin/perangkat"
            icon={FaUserTie}
            label="Perangkat Kelurahan"
            desc="Tambah atau ubah data pejabat kelurahan."
            color="bg-emerald-500/10 text-emerald-500"
          />
          <QuickAction
            href="/admin/berita"
            icon={FaNewspaper}
            label="Kelola Berita"
            desc="Tulis dan publikasikan berita terbaru."
            color="bg-teal-500/10 text-teal-500"
          />
          <QuickAction
            href="/admin/galeri"
            icon={FaImages}
            label="Galeri Foto"
            desc="Upload dan atur foto dokumentasi kegiatan."
            color="bg-rose-500/10 text-rose-500"
          />
          <QuickAction
            href="/admin/infografis"
            icon={FaLayerGroup}
            label="Infografis"
            desc="Unggah gambar infografis untuk publik."
            color="bg-indigo-500/10 text-indigo-500"
          />
        </div>
      </div>

      {/* ── Tips ────────────────────────────────────────────────────────────── */}
      <div className="premium-card p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
            <FaCheckCircle className="text-sm text-accent" />
          </div>
          <h3 className="font-heading font-bold text-base text-foreground">Panduan Cepat</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              num: '1',
              text: (
                <>
                  Isi <strong className="text-foreground">Statistik Penduduk</strong> dan{' '}
                  <strong className="text-foreground">Komposisi Gender</strong> agar data
                  tampil lengkap di halaman publik.
                </>
              ),
            },
            {
              num: '2',
              text: (
                <>
                  Tambahkan <strong className="text-foreground">Berita</strong> dan{' '}
                  <strong className="text-foreground">Galeri Foto</strong> untuk membuat
                  website lebih hidup dan informatif.
                </>
              ),
            },
            {
              num: '3',
              text: (
                <>
                  Isi data <strong className="text-foreground">Perangkat Kelurahan</strong>{' '}
                  dengan nama dan foto pejabat kelurahan yang terkini.
                </>
              ),
            },
            {
              num: '4',
              text: (
                <>
                  Semua perubahan akan{' '}
                  <strong className="text-foreground">langsung tampil</strong> di website
                  publik segera setelah disimpan.
                </>
              ),
            },
          ].map(({ num, text }) => (
            <div key={num} className="flex items-start gap-3 p-4 rounded-xl bg-background-alt/50">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {num}
              </span>
              <p className="text-sm text-foreground-muted leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
