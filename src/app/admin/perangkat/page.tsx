'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Official } from '@/lib/supabase/types';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSave, FaTimes, FaUserTie } from 'react-icons/fa';

export default function PerangkatPage() {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<Official> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const { data } = await supabase
      .from('officials')
      .select('*')
      .order('type', { ascending: true })
      .order('display_order', { ascending: true });
    if (data) setOfficials(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = () => {
    setEditItem({
      name: '', position_id: '', position_en: '', phone: '', photo_url: '',
      type: 'staff', display_order: officials.length + 1,
    });
    setIsNew(true);
  };

  const handleEdit = (item: Official) => {
    setEditItem({ ...item });
    setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus perangkat ini?')) return;
    await supabase.from('officials').delete().eq('id', id);
    fetchData();
  };

  const handleSave = async () => {
    if (!editItem) return;
    setSaving(true);

    const payload = {
      name: editItem.name || '',
      position_id: editItem.position_id || '',
      position_en: editItem.position_en || '',
      phone: editItem.phone || '',
      photo_url: editItem.photo_url || '',
      type: editItem.type || 'staff',
      display_order: editItem.display_order || 0,
    };

    if (isNew) {
      await supabase.from('officials').insert(payload);
    } else if (editItem.id) {
      await supabase.from('officials').update(payload).eq('id', editItem.id);
    }

    setSaving(false);
    setEditItem(null);
    fetchData();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editItem) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `officials/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) { alert('Gagal upload foto: ' + error.message); return; }

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
    setEditItem({ ...editItem, photo_url: publicUrl });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-2xl text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-foreground-muted text-sm">Kelola data perangkat/pejabat kelurahan.</p>
        <button
          onClick={handleAdd}
          className="px-4 py-2.5 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
        >
          <FaPlus /> Tambah
        </button>
      </div>

      {/* Edit/Add Form */}
      {editItem && (
        <div className="premium-card p-6 border-2 border-accent/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-lg text-foreground">
              {isNew ? 'Tambah Perangkat Baru' : 'Edit Perangkat'}
            </h3>
            <button onClick={() => setEditItem(null)} className="p-2 rounded-lg hover:bg-foreground/5 text-foreground-muted">
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Nama</label>
              <input type="text" value={editItem.name || ''} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} placeholder="Nama lengkap"
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Tipe</label>
              <select value={editItem.type || 'staff'} onChange={(e) => setEditItem({ ...editItem, type: e.target.value as 'lurah' | 'staff' })}
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm">
                <option value="lurah">Lurah</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Jabatan (ID)</label>
              <input type="text" value={editItem.position_id || ''} onChange={(e) => setEditItem({ ...editItem, position_id: e.target.value })} placeholder="Sekretaris Lurah"
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Jabatan (EN)</label>
              <input type="text" value={editItem.position_en || ''} onChange={(e) => setEditItem({ ...editItem, position_en: e.target.value })} placeholder="Secretary"
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Telepon</label>
              <input type="text" value={editItem.phone || ''} onChange={(e) => setEditItem({ ...editItem, phone: e.target.value })} placeholder="+62..."
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Urutan Tampil</label>
              <input type="number" value={editItem.display_order ?? ''} onChange={(e) => setEditItem({ ...editItem, display_order: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">Foto</label>
              <input type="file" accept="image/*" onChange={handlePhotoUpload}
                className="w-full text-sm text-foreground-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer" />
              {editItem.photo_url && (
                <p className="mt-2 text-xs text-foreground-muted truncate">URL: {editItem.photo_url}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2.5 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-60">
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button onClick={() => setEditItem(null)}
              className="px-5 py-2.5 border border-foreground/10 text-foreground-muted font-semibold rounded-xl hover:bg-foreground/5 transition-all text-sm">
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/5">
                <th className="px-5 py-4 text-left text-xs font-bold text-foreground-muted uppercase tracking-wider">#</th>
                <th className="px-5 py-4 text-left text-xs font-bold text-foreground-muted uppercase tracking-wider">Nama</th>
                <th className="px-5 py-4 text-left text-xs font-bold text-foreground-muted uppercase tracking-wider">Jabatan</th>
                <th className="px-5 py-4 text-left text-xs font-bold text-foreground-muted uppercase tracking-wider">Tipe</th>
                <th className="px-5 py-4 text-right text-xs font-bold text-foreground-muted uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {officials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-foreground-muted">
                    <FaUserTie className="text-3xl mx-auto mb-3 text-foreground-muted/30" />
                    <p>Belum ada data perangkat. Klik &quot;Tambah&quot; untuk menambahkan.</p>
                  </td>
                </tr>
              ) : (
                officials.map((item, i) => (
                  <tr key={item.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                    <td className="px-5 py-4 text-foreground-muted">{i + 1}</td>
                    <td className="px-5 py-4 font-medium text-foreground">{item.name}</td>
                    <td className="px-5 py-4 text-foreground-muted">{item.position_id}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        item.type === 'lurah' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                      }`}>
                        {item.type === 'lurah' ? 'Lurah' : 'Staff'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 rounded-lg hover:bg-accent/10 text-accent transition-colors">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
