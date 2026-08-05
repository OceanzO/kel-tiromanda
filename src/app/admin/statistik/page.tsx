'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PopulationStats } from '@/lib/supabase/types';
import { FaSave, FaSpinner, FaCheckCircle } from 'react-icons/fa';

export default function StatistikPage() {
  const [data, setData] = useState<Partial<PopulationStats>>({
    total_penduduk: null,
    kepala_keluarga: null,
    luas_wilayah: '',
    lingkungan: 4,
    jumlah_rt: 8,
    mata_pencaharian: 'Petani',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: row } = await supabase
        .from('population_stats')
        .select('*')
        .limit(1)
        .single();
      if (row) setData(row);
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const payload = {
      total_penduduk: data.total_penduduk,
      kepala_keluarga: data.kepala_keluarga,
      luas_wilayah: data.luas_wilayah,
      lingkungan: data.lingkungan,
      jumlah_rt: data.jumlah_rt,
      mata_pencaharian: data.mata_pencaharian,
      updated_at: new Date().toISOString(),
    };

    if (data.id) {
      await supabase.from('population_stats').update(payload).eq('id', data.id);
    } else {
      const { data: inserted } = await supabase.from('population_stats').insert(payload).select().single();
      if (inserted) setData(inserted);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-2xl text-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="premium-card p-6 md:p-8">
        <h2 className="font-heading font-bold text-xl text-foreground mb-2">Statistik Penduduk</h2>
        <p className="text-foreground-muted text-sm mb-8">
          Data ini akan tampil di bagian &quot;Tentang Kami&quot; pada landing page website.
        </p>

        <div className="space-y-6">
          {/* Total Penduduk */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Total Penduduk</label>
            <input
              type="number"
              value={data.total_penduduk ?? ''}
              onChange={(e) => setData({ ...data, total_penduduk: e.target.value ? Number(e.target.value) : null })}
              placeholder="Contoh: 3450"
              className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Kepala Keluarga */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Kepala Keluarga (KK)</label>
            <input
              type="number"
              value={data.kepala_keluarga ?? ''}
              onChange={(e) => setData({ ...data, kepala_keluarga: e.target.value ? Number(e.target.value) : null })}
              placeholder="Contoh: 870"
              className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Luas Wilayah */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Luas Wilayah</label>
            <input
              type="text"
              value={data.luas_wilayah ?? ''}
              onChange={(e) => setData({ ...data, luas_wilayah: e.target.value })}
              placeholder="Contoh: 5.2 km²"
              className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Lingkungan */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Jumlah Lingkungan</label>
            <input
              type="number"
              value={data.lingkungan ?? ''}
              onChange={(e) => setData({ ...data, lingkungan: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Jumlah RT */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Jumlah RT</label>
            <input
              type="number"
              value={data.jumlah_rt ?? ''}
              onChange={(e) => setData({ ...data, jumlah_rt: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Mata Pencaharian */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Mata Pencaharian Dominan</label>
            <input
              type="text"
              value={data.mata_pencaharian ?? ''}
              onChange={(e) => setData({ ...data, mata_pencaharian: e.target.value })}
              placeholder="Contoh: Petani"
              className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-md shadow-accent/25 transition-all duration-300 flex items-center gap-2 text-sm disabled:opacity-60"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          {saved && (
            <span className="flex items-center gap-2 text-sm text-green-500 font-medium">
              <FaCheckCircle /> Tersimpan!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
