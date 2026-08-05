'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { GenderComposition } from '@/lib/supabase/types';
import { FaSave, FaSpinner, FaCheckCircle, FaMale, FaFemale } from 'react-icons/fa';

export default function GenderPage() {
  const [data, setData] = useState<Partial<GenderComposition>>({
    laki_laki: null,
    perempuan: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: row } = await supabase
        .from('gender_composition')
        .select('*')
        .limit(1)
        .single();
      if (row) setData(row);
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const total = (data.laki_laki ?? 0) + (data.perempuan ?? 0);
  const malePercent = total > 0 ? ((data.laki_laki ?? 0) / total * 100).toFixed(1) : '0';
  const femalePercent = total > 0 ? ((data.perempuan ?? 0) / total * 100).toFixed(1) : '0';

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const payload = {
      laki_laki: data.laki_laki,
      perempuan: data.perempuan,
      updated_at: new Date().toISOString(),
    };

    if (data.id) {
      await supabase.from('gender_composition').update(payload).eq('id', data.id);
    } else {
      const { data: inserted } = await supabase.from('gender_composition').insert(payload).select().single();
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
        <h2 className="font-heading font-bold text-xl text-foreground mb-2">Komposisi Jenis Kelamin</h2>
        <p className="text-foreground-muted text-sm mb-8">
          Data ini akan tampil sebagai progress bar di bagian statistik pada landing page.
        </p>

        <div className="space-y-6">
          {/* Laki-laki */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <FaMale className="text-blue-500" /> Laki-laki
            </label>
            <input
              type="number"
              value={data.laki_laki ?? ''}
              onChange={(e) => setData({ ...data, laki_laki: e.target.value ? Number(e.target.value) : null })}
              placeholder="Jumlah penduduk laki-laki"
              className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Perempuan */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <FaFemale className="text-pink-500" /> Perempuan
            </label>
            <input
              type="number"
              value={data.perempuan ?? ''}
              onChange={(e) => setData({ ...data, perempuan: e.target.value ? Number(e.target.value) : null })}
              placeholder="Jumlah penduduk perempuan"
              className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Preview */}
          {total > 0 && (
            <div className="p-5 rounded-xl bg-background-alt border border-foreground/5">
              <h4 className="text-sm font-bold text-foreground mb-4">Preview Tampilan</h4>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-blue-500 font-semibold">Laki-laki: {data.laki_laki?.toLocaleString('id-ID')} ({malePercent}%)</span>
                <span className="text-pink-500 font-semibold">Perempuan: {data.perempuan?.toLocaleString('id-ID')} ({femalePercent}%)</span>
              </div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${malePercent}%` }} />
                <div className="h-full bg-accent transition-all duration-500" style={{ width: `${femalePercent}%` }} />
              </div>
              <p className="text-xs text-foreground-muted mt-2 text-center">Total: {total.toLocaleString('id-ID')} jiwa</p>
            </div>
          )}
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
