'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Official } from '@/lib/supabase/types';
import { FaSpinner, FaSave, FaUserTie } from 'react-icons/fa';

const PREDEFINED_POSITIONS = [
  { type: 'lurah', position_id: 'Lurah Tiromanda', position_en: 'Village Head of Tiromanda', display_order: 0 },
  { type: 'staff', position_id: 'Sekretaris Lurah', position_en: 'Secretary', display_order: 1 },
  { type: 'staff', position_id: 'Kasi Sosial & Budaya', position_en: 'Head of Social & Cultural Affairs', display_order: 2 },
  { type: 'staff', position_id: 'Kasi Pemerintahan', position_en: 'Head of Government Affairs', display_order: 3 },
  { type: 'staff', position_id: 'Kasi Trantib', position_en: 'Head of Public Order and Security', display_order: 4 },
];

const PREDEFINED_NEIGHBORHOODS = [
  { name_id: 'Lingkungan Bulaan', rts: ['RT. Bullean', "RT. Lonno'"] },
  { name_id: "Lingkungan Pasa' Buntu", rts: ["RT. Pasa'", 'RT. Buntu Borong'] },
  { name_id: "Lingkungan Po'pong", rts: ["RT. Po'pong", "RT. To'long"] },
  { name_id: 'Lingkungan Bau', rts: ['RT. Bau', 'RT. Kalimbuang'] },
];

type RTState = { id?: string; position: string; name: string };
type NeighborhoodState = {
  id?: string;
  name_id: string;
  head_name: string;
  display_order: number;
  rts: RTState[];
};

export default function PerangkatPage() {
  const [officials, setOfficials] = useState<Partial<Official>[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodState[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    // 1. Fetch Officials
    const { data: oData } = await supabase.from('officials').select('*');
    const mergedOfficials = PREDEFINED_POSITIONS.map(pos => {
      const existing = oData?.find(o => o.position_id === pos.position_id);
      if (existing) return existing;
      return {
        name: '',
        position_id: pos.position_id,
        position_en: pos.position_en,
        phone: '',
        photo_url: '',
        type: pos.type as 'lurah' | 'staff',
        display_order: pos.display_order,
      };
    });
    setOfficials(mergedOfficials);

    // 2. Fetch Neighborhoods and RTs
    const { data: nData } = await supabase.from('neighborhoods').select('*');
    const { data: rtData } = await supabase.from('neighborhood_rts').select('*');
    
    const mergedNeighborhoods = PREDEFINED_NEIGHBORHOODS.map((pref, i) => {
      const existingN = nData?.find(n => n.name_id === pref.name_id);
      const rts = pref.rts.map(rtPos => {
        const existingRT = rtData?.find(rt => rt.neighborhood_id === existingN?.id && rt.position === rtPos);
        return {
          id: existingRT?.id,
          position: rtPos,
          name: existingRT?.name || '',
        };
      });

      return {
        id: existingN?.id,
        name_id: pref.name_id,
        head_name: existingN?.head_name || '',
        display_order: i + 1,
        rts,
      };
    });
    setNeighborhoods(mergedNeighborhoods);

    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOfficialChange = (index: number, field: keyof Official, value: string) => {
    const newOfficials = [...officials];
    newOfficials[index] = { ...newOfficials[index], [field]: value };
    setOfficials(newOfficials);
    setSaved(false);
  };

  const handlePhotoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `officials/${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) { alert('Gagal upload foto: ' + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
    handleOfficialChange(index, 'photo_url', publicUrl);
  };

  const handleNeighborhoodChange = (nIndex: number, value: string) => {
    const newN = [...neighborhoods];
    newN[nIndex] = { ...newN[nIndex], head_name: value };
    setNeighborhoods(newN);
    setSaved(false);
  };

  const handleRTChange = (nIndex: number, rtIndex: number, value: string) => {
    const newN = [...neighborhoods];
    newN[nIndex].rts[rtIndex] = { ...newN[nIndex].rts[rtIndex], name: value };
    setNeighborhoods(newN);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    // Save Officials
    for (const item of officials) {
      if (item.id) {
        await supabase.from('officials').update(item).eq('id', item.id);
      } else if (item.name) {
        await supabase.from('officials').insert(item);
      }
    }

    // Save Neighborhoods & RTs
    for (const n of neighborhoods) {
      let nId = n.id;
      const nPayload = { 
        name_id: n.name_id, 
        name_en: n.name_id.replace('Lingkungan', 'Neighborhood'), 
        head_name: n.head_name, 
        display_order: n.display_order 
      };
      
      if (nId) {
        await supabase.from('neighborhoods').update(nPayload).eq('id', nId);
      } else if (n.head_name) {
        // Only create if there's a head name or RT data to avoid spamming empty rows
        const { data } = await supabase.from('neighborhoods').insert(nPayload).select().single();
        if (data) nId = data.id;
      }

      if (nId) {
        for (const rt of n.rts) {
          const rtPayload = { neighborhood_id: nId, position: rt.position, name: rt.name };
          if (rt.id) {
            await supabase.from('neighborhood_rts').update(rtPayload).eq('id', rt.id);
          } else if (rt.name) {
            await supabase.from('neighborhood_rts').insert(rtPayload);
          }
        }
      }
    }

    await fetchData();
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
    <div className="max-w-5xl space-y-6">
      <div className="premium-card p-6 md:p-8">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-2">Struktur Perangkat Kelurahan</h2>
        <p className="text-foreground-muted text-sm mb-8">
          Silakan isi nama dan unggah foto untuk masing-masing jabatan. Data ini akan langsung sinkron dengan bagan struktur di halaman utama website.
        </p>

        {/* --- Bagian Perangkat --- */}
        <div className="space-y-4 mb-10">
          {officials.map((item, index) => (
            <div key={index} className="p-4 border border-foreground/10 rounded-2xl bg-background-alt flex flex-col sm:flex-row gap-5 items-center">
              
              {/* Photo Preview */}
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center overflow-hidden border-2 border-accent/20 shadow-inner">
                  {item.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.photo_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <FaUserTie className="text-3xl text-foreground-muted/30" />
                  )}
                </div>
                <div>
                  <input 
                    type="file" 
                    id={`photo-${index}`}
                    accept="image/*" 
                    onChange={(e) => handlePhotoUpload(index, e)}
                    className="hidden" 
                  />
                  <label 
                    htmlFor={`photo-${index}`}
                    className="text-[10px] font-bold px-3 py-1.5 bg-accent/10 text-accent rounded-lg cursor-pointer hover:bg-accent hover:text-white transition-all shadow-sm"
                  >
                    Unggah Foto
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1 w-full flex flex-col justify-center">
                <label className="block text-xs font-bold text-accent uppercase tracking-wider mb-0.5">
                  Jabatan
                </label>
                <div className="font-heading font-bold text-lg text-foreground mb-2">
                  {item.position_id}
                </div>
                <input
                  type="text"
                  value={item.name || ''}
                  onChange={(e) => handleOfficialChange(index, 'name', e.target.value)}
                  placeholder="Contoh: Budi Santoso, S.Sos"
                  className="w-full px-4 py-2 bg-background border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/40 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        {/* --- Bagian Lingkungan & RT --- */}
        <h2 className="font-heading font-bold text-xl text-foreground mb-4 pt-6 border-t border-border">Kepala Lingkungan & RT</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {neighborhoods.map((n, nIndex) => (
            <div key={nIndex} className="p-4 border border-foreground/10 rounded-2xl bg-background-alt shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-black flex items-center justify-center shrink-0">
                  {nIndex + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-foreground">{n.name_id}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Kepala Lingkungan */}
                <div>
                  <label className="block text-[11px] font-bold text-foreground-muted uppercase tracking-wider mb-1">Kepala Lingkungan</label>
                  <input
                    type="text"
                    value={n.head_name}
                    onChange={(e) => handleNeighborhoodChange(nIndex, e.target.value)}
                    placeholder="Nama Kepala Lingkungan"
                    className="w-full px-3 py-2 bg-background border border-foreground/10 rounded-lg text-foreground placeholder-foreground-muted/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
                
                {/* RTs */}
                <div className="grid grid-cols-2 gap-2">
                  {n.rts.map((rt, rtIndex) => (
                    <div key={rtIndex}>
                      <label className="block text-[11px] font-bold text-foreground-muted uppercase tracking-wider mb-1">{rt.position}</label>
                      <input
                        type="text"
                        value={rt.name}
                        onChange={(e) => handleRTChange(nIndex, rtIndex, e.target.value)}
                        placeholder="Nama Ketua RT"
                        className="w-full px-3 py-2 bg-background border border-foreground/10 rounded-lg text-foreground placeholder-foreground-muted/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- Save Button --- */}
        <div className="mt-8 flex items-center gap-4 border-t border-border pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          {saved && (
            <span className="text-green-500 font-semibold text-sm flex items-center gap-1 animate-fade-in">
              <FaSave className="text-lg" /> Tersimpan!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
