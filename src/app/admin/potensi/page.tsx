'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { Potential } from '@/lib/supabase/types';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSave, FaTimes, FaMountain, FaSync } from 'react-icons/fa';

const translateText = async (text: string): Promise<string> => {
  if (!text) return '';
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=en&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    return data[0].map((item: any) => item[0]).join('');
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export default function PotensiPage() {
  const [items, setItems] = useState<Potential[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<Potential> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from('potentials').select('*').order('display_order');
    if (data) setItems(data);
    setLoading(false);
  }, [supabase]);

  const handleLoadDefaults = async () => {
    setLoading(true);
    const { POTENTIALS } = await import('@/lib/constants');
    const payloads = POTENTIALS.map((p, i) => ({
      title_id: p.title_id,
      title_en: p.title_en,
      description_id: p.description_id,
      description_en: p.description_en,
      icon: p.icon,
      image_url: p.image,
      display_order: i + 1,
    }));
    await supabase.from('potentials').insert(payloads);
    fetchData();
  };

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = () => {
    setEditItem({ title_id: '', title_en: '', description_id: '', description_en: '', icon: '', image_url: '', display_order: items.length + 1 });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editItem) return;
    setSaving(true);
    
    // Auto-translate to English
    const title_en = await translateText(editItem.title_id || '');
    const description_en = await translateText(editItem.description_id || '');

    const payload = {
      title_id: editItem.title_id || '', 
      title_en,
      description_id: editItem.description_id || '', 
      description_en,
      icon: '', 
      image_url: editItem.image_url || '',
      display_order: editItem.display_order || 0,
    };
    if (isNew) {
      await supabase.from('potentials').insert(payload);
    } else if (editItem.id) {
      await supabase.from('potentials').update(payload).eq('id', editItem.id);
    }
    setSaving(false); setEditItem(null); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus?')) return;
    await supabase.from('potentials').delete().eq('id', id);
    fetchData();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editItem) return;
    const fileName = `potentials/${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) { alert('Gagal upload: ' + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
    setEditItem({ ...editItem, image_url: publicUrl });
  };

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="animate-spin text-2xl text-accent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-foreground-muted text-sm">Kelola potensi unggulan kelurahan.</p>
        <button onClick={handleAdd} className="px-4 py-2.5 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm">
          <FaPlus /> Tambah
        </button>
      </div>

      {editItem && (
        <div className="premium-card p-6 border-2 border-accent/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-lg text-foreground">{isNew ? 'Tambah Potensi' : 'Edit Potensi'}</h3>
            <button onClick={() => setEditItem(null)} className="p-2 rounded-lg hover:bg-foreground/5 text-foreground-muted"><FaTimes /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Judul</label>
              <input type="text" value={editItem.title_id ?? ''} onChange={(e) => setEditItem({ ...editItem, title_id: e.target.value })} placeholder="Masukkan Judul..."
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Urutan Tampil</label>
              <input type="number" value={editItem.display_order ?? 0} onChange={(e) => setEditItem({ ...editItem, display_order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">Deskripsi</label>
              <textarea value={editItem.description_id ?? ''} onChange={(e) => setEditItem({ ...editItem, description_id: e.target.value })} rows={3} placeholder="Masukkan Deskripsi..."
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">Gambar</label>
              <input type="file" accept="image/*" onChange={handleImageUpload}
                className="w-full text-sm text-foreground-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer" />
              {editItem.image_url && <p className="mt-2 text-xs text-foreground-muted truncate">URL: {editItem.image_url}</p>}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-60">
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button onClick={() => setEditItem(null)} className="px-5 py-2.5 border border-foreground/10 text-foreground-muted font-semibold rounded-xl hover:bg-foreground/5 transition-all text-sm">Batal</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="premium-card p-12 flex flex-col items-center justify-center text-center mt-6">
          <FaMountain className="text-6xl text-foreground-muted/20 mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Belum ada data potensi</h3>
          <p className="text-foreground-muted mb-8 max-w-lg">
            Data potensi kelurahan Anda masih kosong di database. Anda dapat memuat data bawaan dari <i>landing page</i> untuk mulai mengedit, atau menambahkannya dari awal secara manual.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleLoadDefaults} className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm">
              <FaSync /> Muat Data Bawaan
            </button>
            <button onClick={handleAdd} className="px-6 py-3 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm">
              <FaPlus /> Tambah Manual
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {items.map((item) => (
            <div key={item.id} className="premium-card overflow-hidden flex flex-col group border border-foreground/5 relative shadow-md hover:shadow-xl transition-all duration-300">
              {/* Image Header */}
              <div className="relative h-56 shrink-0 bg-background-alt overflow-hidden">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.title_id} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/5">
                    <FaMountain className="text-5xl text-foreground/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A2C]/80 via-transparent to-transparent z-10" />
                
                <div className="absolute bottom-5 left-5 z-20 flex items-center gap-3 w-[calc(100%-2.5rem)]">
                  <h4 className="font-heading font-bold text-white text-xl drop-shadow-md truncate">{item.title_id}</h4>
                </div>

                {/* Action buttons overlaid on top right */}
                <div className="absolute top-4 right-4 z-30 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={() => { setEditItem({ ...item }); setIsNew(false); }} className="w-9 h-9 rounded-full bg-white/95 text-accent flex items-center justify-center hover:bg-white hover:scale-110 shadow-lg transition-all" title="Edit">
                    <FaEdit size={14} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="w-9 h-9 rounded-full bg-red-500/95 text-white flex items-center justify-center hover:bg-red-500 hover:scale-110 shadow-lg transition-all" title="Hapus">
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1 block">Deskripsi Singkat</span>
                  <p className="text-sm text-foreground leading-relaxed line-clamp-3">{item.description_id}</p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-foreground/10 flex items-center justify-end text-xs text-foreground-muted">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">Urutan:</span>
                    <span className="bg-foreground/5 px-2 py-1 rounded w-6 text-center">{item.display_order}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
