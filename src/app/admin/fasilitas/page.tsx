'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { Facility } from '@/lib/supabase/types';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSave, FaTimes, FaBuilding, FaSync, FaCheckCircle } from 'react-icons/fa';

const translateText = async (text: string): Promise<string> => {
  if (!text) return '';
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=id|en`);
    const data = await res.json();
    return data.responseData?.translatedText || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export default function FasilitasPage() {
  const [items, setItems] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<Facility> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from('facilities').select('*').order('display_order');
    if (data) setItems(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLoadDefaults = async () => {
    setLoading(true);
    const { FACILITIES } = await import('@/lib/constants');
    const payloads = FACILITIES.map((p, i) => ({
      name_id: p.name_id,
      name_en: p.name_en,
      description_id: p.description_id,
      description_en: p.description_en,
      location: p.location,
      image_url: p.image,
      display_order: i + 1,
    }));
    await supabase.from('facilities').insert(payloads);
    fetchData();
  };

  const handleAdd = () => {
    setEditItem({ name_id: '', image_url: '', display_order: items.length + 1 });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editItem) return;
    setSaving(true);

    // Auto-translate to English
    const name_en = await translateText(editItem.name_id || '');
    const description_en = await translateText(editItem.description_id || '');

    const payload = {
      name_id: editItem.name_id || '', name_en,
      description_id: editItem.description_id || '', description_en,
      location: editItem.location || '', image_url: editItem.image_url || '',
      display_order: editItem.display_order || 0,
    };
    if (isNew) { await supabase.from('facilities').insert(payload); }
    else if (editItem.id) { await supabase.from('facilities').update(payload).eq('id', editItem.id); }
    setSaving(false); setEditItem(null); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus?')) return;
    await supabase.from('facilities').delete().eq('id', id);
    fetchData();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editItem) return;
    setUploading(true);
    try {
      const fileName = `facilities/${Date.now()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('images').upload(fileName, file);
      if (error) { alert('Gagal upload: ' + error.message); setUploading(false); return; }
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
      setEditItem({ ...editItem, image_url: publicUrl });
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat upload gambar');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="animate-spin text-2xl text-accent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-foreground-muted text-sm">Kelola data fasilitas umum kelurahan.</p>
        <button onClick={handleAdd} className="px-4 py-2.5 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm">
          <FaPlus /> Tambah
        </button>
      </div>

      {editItem && (
        <div className="premium-card p-6 border-2 border-accent/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-lg text-foreground">{isNew ? 'Tambah Fasilitas' : 'Edit Fasilitas'}</h3>
            <button onClick={() => setEditItem(null)} className="p-2 rounded-lg hover:bg-foreground/5 text-foreground-muted"><FaTimes /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Nama Fasilitas</label>
              <input type="text" value={editItem.name_id || ''} onChange={(e) => setEditItem({ ...editItem, name_id: e.target.value })} placeholder="Cth: Taman Bermain atau Rumah Sakit"
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Urutan</label>
              <input type="number" value={editItem.display_order ?? ''} onChange={(e) => setEditItem({ ...editItem, display_order: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">Gambar</label>
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
                  className="w-full text-sm text-foreground-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer disabled:opacity-50" />
                {uploading && <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-accent text-sm"><FaSpinner className="animate-spin" /> Mengupload...</div>}
              </div>
              {editItem.image_url && !uploading && <p className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1"><FaCheckCircle /> Gambar berhasil diupload</p>}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={handleSave} disabled={saving || uploading} className="px-5 py-2.5 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button onClick={() => setEditItem(null)} className="px-5 py-2.5 border border-foreground/10 text-foreground-muted font-semibold rounded-xl hover:bg-foreground/5 transition-all text-sm">Batal</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="premium-card p-12 flex flex-col items-center justify-center text-center mt-6">
          <FaBuilding className="text-6xl text-foreground-muted/20 mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Belum ada data fasilitas</h3>
          <p className="text-foreground-muted mb-8 max-w-lg">
            Data fasilitas kelurahan Anda masih kosong di database. Anda dapat memuat data bawaan dari <i>landing page</i> untuk mulai mengedit, atau menambahkannya dari awal secara manual.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {items.map((item) => (
            <div key={item.id} className="premium-card overflow-hidden flex flex-col group border border-foreground/5 relative shadow-md hover:shadow-xl transition-all duration-300">
              {/* Image Header */}
              <div className="relative h-48 shrink-0 bg-background-alt overflow-hidden">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name_id} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/5">
                    <FaBuilding className="text-5xl text-foreground/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A2C]/80 via-transparent to-transparent z-10" />

                <div className="absolute bottom-5 left-5 z-20 flex items-center gap-3 w-[calc(100%-2.5rem)]">
                  <h4 className="font-heading font-bold text-white text-xl drop-shadow-md truncate">{item.name_id}</h4>
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
              <div className="p-4 flex flex-col flex-grow">
                <div className="mt-auto flex items-center justify-between text-xs text-foreground-muted">
                  <span className="font-semibold">Urutan Tampil:</span>
                  <span className="bg-foreground/5 px-2 py-1 rounded w-8 text-center font-bold text-foreground">{item.display_order}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
