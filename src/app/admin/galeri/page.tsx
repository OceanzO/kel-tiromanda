'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { GalleryImage } from '@/lib/supabase/types';
import { FaPlus, FaTrash, FaSpinner, FaSave, FaTimes, FaImages } from 'react-icons/fa';
import { translateText } from '@/lib/translate';
const CATEGORIES = [
  { id: 'kkn', label: 'Kegiatan KKN' },
  { id: 'community', label: 'Kegiatan Masyarakat' },
  { id: 'events', label: 'Acara Desa' },
  { id: 'tourism', label: 'Wisata' },
  { id: 'cultural', label: 'Budaya' },
  { id: 'facilities', label: 'Fasilitas' },
];

export default function GaleriPage() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<GalleryImage> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from('gallery').select('*').order('display_order');
    if (data) setItems(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = () => {
    setEditItem({ image_url: '', category: 'community', caption_id: '', caption_en: '', display_order: items.length + 1 });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editItem) return;
    setSaving(true);
    const caption_en = await translateText(editItem.caption_id || '');
    const payload = {
      image_url: editItem.image_url || '', category: editItem.category || 'community',
      caption_id: editItem.caption_id || '', caption_en: caption_en,
      display_order: editItem.display_order || 0,
    };
    if (isNew) { await supabase.from('gallery').insert(payload); }
    else if (editItem.id) { await supabase.from('gallery').update(payload).eq('id', editItem.id); }
    setSaving(false); setEditItem(null); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus foto ini?')) return;
    await supabase.from('gallery').delete().eq('id', id);
    fetchData();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editItem) return;
    setUploading(true);
    const fileName = `gallery/${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) { alert('Gagal upload: ' + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
    setEditItem({ ...editItem, image_url: publicUrl });
    setUploading(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="animate-spin text-2xl text-accent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-foreground-muted text-sm">Kelola galeri foto kelurahan.</p>
        <button onClick={handleAdd} className="px-4 py-2.5 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm">
          <FaPlus /> Tambah Foto
        </button>
      </div>

      {editItem && (
        <div className="premium-card p-6 border-2 border-accent/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-lg text-foreground">{isNew ? 'Tambah Foto' : 'Edit Foto'}</h3>
            <button onClick={() => setEditItem(null)} className="p-2 rounded-lg hover:bg-foreground/5 text-foreground-muted"><FaTimes /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Caption</label>
              <input type="text" value={editItem.caption_id || ''} onChange={(e) => setEditItem({ ...editItem, caption_id: e.target.value })} placeholder="Keterangan foto"
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Kategori</label>
              <select value={editItem.category || 'community'} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm">
                {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Urutan</label>
              <input type="number" value={editItem.display_order ?? ''} onChange={(e) => setEditItem({ ...editItem, display_order: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">Upload Foto</label>
              <input type="file" accept="image/*" onChange={handleImageUpload}
                className="w-full text-sm text-foreground-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer" />
              {uploading && <p className="mt-2 text-xs text-accent flex items-center gap-1"><FaSpinner className="animate-spin" /> Mengupload...</p>}
              {editItem.image_url && (
                <div className="mt-3 relative w-48 aspect-video rounded-xl overflow-hidden border border-foreground/10">
                  <Image src={editItem.image_url} alt="Preview" fill className="object-cover" sizes="200px" />
                </div>
              )}
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
        <div className="premium-card p-12 text-center">
          <FaImages className="text-3xl mx-auto mb-3 text-foreground-muted/30" />
          <p className="text-foreground-muted">Belum ada foto di galeri.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item) => (
            <div key={item.id} className="premium-card overflow-hidden group relative">
              <div className="relative aspect-video bg-background-alt">
                {item.image_url && (
                  <Image src={item.image_url} alt={item.caption_id} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2.5 rounded-full bg-red-500/80 text-white hover:bg-red-500">
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-foreground truncate">{item.caption_id}</p>
                <span className="text-[10px] text-foreground-muted uppercase tracking-wider">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
