'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Potential } from '@/lib/supabase/types';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSave, FaTimes, FaMountain } from 'react-icons/fa';

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

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = () => {
    setEditItem({ title_id: '', title_en: '', description_id: '', description_en: '', icon: 'FaMapMarkedAlt', image_url: '', display_order: items.length + 1 });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editItem) return;
    setSaving(true);
    const payload = {
      title_id: editItem.title_id || '', title_en: editItem.title_en || '',
      description_id: editItem.description_id || '', description_en: editItem.description_en || '',
      icon: editItem.icon || 'FaMapMarkedAlt', image_url: editItem.image_url || '',
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
              <label className="block text-sm font-semibold text-foreground mb-1.5">Judul (ID)</label>
              <input type="text" value={editItem.title_id || ''} onChange={(e) => setEditItem({ ...editItem, title_id: e.target.value })} placeholder="Pariwisata"
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Judul (EN)</label>
              <input type="text" value={editItem.title_en || ''} onChange={(e) => setEditItem({ ...editItem, title_en: e.target.value })} placeholder="Tourism"
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">Deskripsi (ID)</label>
              <textarea value={editItem.description_id || ''} onChange={(e) => setEditItem({ ...editItem, description_id: e.target.value })} rows={3} placeholder="Deskripsi dalam Bahasa Indonesia..."
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">Deskripsi (EN)</label>
              <textarea value={editItem.description_en || ''} onChange={(e) => setEditItem({ ...editItem, description_en: e.target.value })} rows={3} placeholder="Description in English..."
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Ikon (React Icon name)</label>
              <input type="text" value={editItem.icon || ''} onChange={(e) => setEditItem({ ...editItem, icon: e.target.value })} placeholder="FaMapMarkedAlt"
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Urutan Tampil</label>
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
                <th className="px-5 py-4 text-left text-xs font-bold text-foreground-muted uppercase tracking-wider">Judul</th>
                <th className="px-5 py-4 text-left text-xs font-bold text-foreground-muted uppercase tracking-wider">Ikon</th>
                <th className="px-5 py-4 text-right text-xs font-bold text-foreground-muted uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-foreground-muted">
                  <FaMountain className="text-3xl mx-auto mb-3 text-foreground-muted/30" />
                  <p>Belum ada data potensi.</p>
                </td></tr>
              ) : items.map((item, i) => (
                <tr key={item.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-5 py-4 text-foreground-muted">{i + 1}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{item.title_id}</td>
                  <td className="px-5 py-4 text-foreground-muted font-mono text-xs">{item.icon}</td>
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
