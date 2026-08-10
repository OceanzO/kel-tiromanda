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
        .order('updated_at', { ascending: false })
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
      const { error } = await supabase.from('population_stats').update(payload).eq('id', data.id);
      if (error) {
        alert('Gagal menyimpan: ' + error.message);
        setSaving(false);
        return;
      }
    } else {
      const { data: inserted, error } = await supabase.from('population_stats').insert(payload).select().single();
      if (error) {
        alert('Gagal menyimpan: ' + error.message);
        setSaving(false);
        return;
      }
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
              type="text"
              value={data.total_penduduk ? data.total_penduduk.toLocaleString('id-ID') : ''}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setData({ ...data, total_penduduk: val ? Number(val) : null });
              }}
              placeholder="Ketik total jiwa (Misal: 1.250)"
              className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Kepala Keluarga */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Kepala Keluarga (KK)</label>
            <input
              type="text"
              value={data.kepala_keluarga ? data.kepala_keluarga.toLocaleString('id-ID') : ''}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setData({ ...data, kepala_keluarga: val ? Number(val) : null });
              }}
              placeholder="Ketik jumlah KK (Misal: 450)"
              className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Luas Wilayah */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Luas Wilayah</label>
            <div className="relative">
              <input
                type="text"
                value={data.luas_wilayah ?? ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.,]/g, '');
                  setData({ ...data, luas_wilayah: val });
                }}
                placeholder="Ketik angka (Misal: 12,5)"
                className="w-full pl-4 pr-16 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="text-foreground-muted font-medium">km²</span>
              </div>
            </div>
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
