'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { Infographic } from '@/lib/supabase/types';
import { FaPlus, FaTrash, FaSpinner, FaSave, FaTimes, FaChartBar } from 'react-icons/fa';

export default function InfografisPage() {
  const [items, setItems] = useState<Infographic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<Infographic> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from('infographics').select('*').order('display_order');
    if (data) setItems(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = () => {
    setEditItem({ title: '', image_url: '', display_order: items.length + 1 });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editItem) return;
    setSaving(true);
    const payload = { title: editItem.title || '', image_url: editItem.image_url || '', display_order: editItem.display_order || 0 };
    if (isNew) { await supabase.from('infographics').insert(payload); }
    else if (editItem.id) { await supabase.from('infographics').update(payload).eq('id', editItem.id); }
    setSaving(false); setEditItem(null); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus infografis ini?')) return;
    await supabase.from('infographics').delete().eq('id', id);
    fetchData();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editItem) return;
    setUploading(true);
    const fileName = `infographics/${Date.now()}.${file.name.split('.').pop()}`;
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
        <p className="text-foreground-muted text-sm">Upload dan kelola gambar infografis kelurahan.</p>
        <button onClick={handleAdd} className="px-4 py-2.5 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm">
          <FaPlus /> Tambah
        </button>
      </div>

      {editItem && (
        <div className="premium-card p-6 border-2 border-accent/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-lg text-foreground">{isNew ? 'Tambah Infografis' : 'Edit Infografis'}</h3>
            <button onClick={() => setEditItem(null)} className="p-2 rounded-lg hover:bg-foreground/5 text-foreground-muted"><FaTimes /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Judul</label>
              <input type="text" value={editItem.title || ''} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} placeholder="Peta Infografis Kelurahan"
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Urutan</label>
              <input type="number" value={editItem.display_order ?? ''} onChange={(e) => setEditItem({ ...editItem, display_order: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Gambar Infografis</label>
              <input type="file" accept="image/*" onChange={handleImageUpload}
                className="w-full text-sm text-foreground-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer" />
              {uploading && <p className="mt-2 text-xs text-accent flex items-center gap-1"><FaSpinner className="animate-spin" /> Mengupload...</p>}
              {editItem.image_url && (
                <div className="mt-3 relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-foreground/10">
                  <Image src={editItem.image_url} alt="Preview" fill className="object-contain" sizes="400px" />
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

      {/* Grid View */}
      {items.length === 0 ? (
        <div className="premium-card p-12 text-center">
          <FaChartBar className="text-3xl mx-auto mb-3 text-foreground-muted/30" />
          <p className="text-foreground-muted">Belum ada infografis. Klik &quot;Tambah&quot; untuk menambahkan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="premium-card overflow-hidden group">
              <div className="relative aspect-video bg-background-alt">
                {item.image_url && (
                  <Image src={item.image_url} alt={item.title} fill className="object-contain" sizes="(max-width: 768px) 100vw, 33vw" />
                )}
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="font-medium text-foreground text-sm truncate">{item.title}</p>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors shrink-0">
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
