'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Facility } from '@/lib/supabase/types';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSave, FaTimes, FaBuilding } from 'react-icons/fa';

export default function FasilitasPage() {
  const [items, setItems] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<Facility> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from('facilities').select('*').order('display_order');
    if (data) setItems(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = () => {
    setEditItem({ name_id: '', name_en: '', description_id: '', description_en: '', location: '', image_url: '', display_order: items.length + 1 });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editItem) return;
    setSaving(true);
    const payload = {
      name_id: editItem.name_id || '', name_en: editItem.name_en || '',
      description_id: editItem.description_id || '', description_en: editItem.description_en || '',
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
    const fileName = `facilities/${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) { alert('Gagal upload: ' + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
    setEditItem({ ...editItem, image_url: publicUrl });
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
              <label className="block text-sm font-semibold text-foreground mb-1.5">Nama (ID)</label>
              <input type="text" value={editItem.name_id || ''} onChange={(e) => setEditItem({ ...editItem, name_id: e.target.value })} placeholder="Kantor Kelurahan"
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Nama (EN)</label>
              <input type="text" value={editItem.name_en || ''} onChange={(e) => setEditItem({ ...editItem, name_en: e.target.value })} placeholder="Village Office"
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">Deskripsi (ID)</label>
              <textarea value={editItem.description_id || ''} onChange={(e) => setEditItem({ ...editItem, description_id: e.target.value })} rows={2}
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">Deskripsi (EN)</label>
              <textarea value={editItem.description_en || ''} onChange={(e) => setEditItem({ ...editItem, description_en: e.target.value })} rows={2}
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Lokasi</label>
              <input type="text" value={editItem.location || ''} onChange={(e) => setEditItem({ ...editItem, location: e.target.value })} placeholder="Jl. Poros Makale"
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Urutan</label>
              <input type="number" value={editItem.display_order ?? ''} onChange={(e) => setEditItem({ ...editItem, display_order: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
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

      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/5">
                <th className="px-5 py-4 text-left text-xs font-bold text-foreground-muted uppercase tracking-wider">#</th>
                <th className="px-5 py-4 text-left text-xs font-bold text-foreground-muted uppercase tracking-wider">Nama</th>
                <th className="px-5 py-4 text-left text-xs font-bold text-foreground-muted uppercase tracking-wider">Lokasi</th>
                <th className="px-5 py-4 text-right text-xs font-bold text-foreground-muted uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-foreground-muted">
                  <FaBuilding className="text-3xl mx-auto mb-3 text-foreground-muted/30" />
                  <p>Belum ada data fasilitas.</p>
                </td></tr>
              ) : items.map((item, i) => (
                <tr key={item.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-5 py-4 text-foreground-muted">{i + 1}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{item.name_id}</td>
                  <td className="px-5 py-4 text-foreground-muted">{item.location}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditItem({ ...item }); setIsNew(false); }} className="p-2 rounded-lg hover:bg-accent/10 text-accent transition-colors"><FaEdit /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
