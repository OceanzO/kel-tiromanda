'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  FaUsers, FaUserTie, FaMountain, FaBuilding,
  FaImages, FaNewspaper, FaChartBar, FaVenusMars
} from 'react-icons/fa';

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
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

        setStats([
          { label: 'Total Penduduk', value: popData?.total_penduduk ?? '-', icon: FaUsers, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
          { label: 'Laki-laki', value: genderData?.laki_laki ?? '-', icon: FaVenusMars, color: 'text-sky-500', bgColor: 'bg-sky-500/10' },
          { label: 'Perempuan', value: genderData?.perempuan ?? '-', icon: FaVenusMars, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
          { label: 'Perangkat', value: officialsCount ?? 0, icon: FaUserTie, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
          { label: 'Potensi', value: potentialsCount ?? 0, icon: FaMountain, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
          { label: 'Fasilitas', value: facilitiesCount ?? 0, icon: FaBuilding, color: 'text-violet-500', bgColor: 'bg-violet-500/10' },
          { label: 'Galeri Foto', value: galleryCount ?? 0, icon: FaImages, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
          { label: 'Berita', value: newsCount ?? 0, icon: FaNewspaper, color: 'text-teal-500', bgColor: 'bg-teal-500/10' },
        ]);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setStats([
          { label: 'Total Penduduk', value: '-', icon: FaUsers, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
          { label: 'Laki-laki', value: '-', icon: FaVenusMars, color: 'text-sky-500', bgColor: 'bg-sky-500/10' },
          { label: 'Perempuan', value: '-', icon: FaVenusMars, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
          { label: 'Perangkat', value: 0, icon: FaUserTie, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
          { label: 'Potensi', value: 0, icon: FaMountain, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
          { label: 'Fasilitas', value: 0, icon: FaBuilding, color: 'text-violet-500', bgColor: 'bg-violet-500/10' },
          { label: 'Galeri Foto', value: 0, icon: FaImages, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
          { label: 'Berita', value: 0, icon: FaNewspaper, color: 'text-teal-500', bgColor: 'bg-teal-500/10' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [supabase]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl p-8 md:p-10"
        style={{ background: 'linear-gradient(135deg, #1F3A2C 0%, #2d5a3f 50%, #1F3A2C 100%)' }}
      >
        <div className="absolute inset-0 section-pattern opacity-10" />
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
        <div className="relative">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
            Selamat Datang di Dashboard Admin 👋
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-xl">
            Kelola data website Kelurahan Tiromanda dari sini. Pilih menu di sidebar untuk menambah, mengedit, atau menghapus konten.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h3 className="font-heading font-bold text-lg text-foreground mb-4">Ringkasan Data</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="premium-card p-5 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-3 bg-foreground/10 rounded" />
                  <div className="w-10 h-10 bg-foreground/10 rounded-xl" />
                </div>
                <div className="w-12 h-7 bg-foreground/10 rounded" />
              </div>
            ))
          ) : (
            stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="premium-card p-5 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
                      {stat.label}
                    </span>
                    <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
                      <Icon className="text-lg" />
                    </div>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString('id-ID') : stat.value}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Info */}
      <div className="premium-card p-6">
        <h3 className="font-heading font-bold text-lg text-foreground mb-3">
          <FaChartBar className="inline mr-2 text-accent" />
          Panduan Cepat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-foreground-muted">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-background-alt/50">
            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
            <p>Gunakan menu <strong className="text-foreground">Statistik Penduduk</strong> untuk mengisi data jumlah penduduk yang tampil di landing page.</p>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-background-alt/50">
            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
            <p>Tambahkan <strong className="text-foreground">Berita</strong> dan <strong className="text-foreground">Galeri Foto</strong> untuk membuat website lebih hidup dan informatif.</p>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-background-alt/50">
            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
            <p>Isi data <strong className="text-foreground">Perangkat Kelurahan</strong> dengan nama dan foto pejabat kelurahan.</p>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-background-alt/50">
            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
            <p>Semua perubahan akan <strong className="text-foreground">langsung tampil</strong> di website publik setelah disimpan.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
