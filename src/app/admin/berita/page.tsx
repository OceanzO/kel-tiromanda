'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { NewsArticle } from '@/lib/supabase/types';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSave, FaTimes, FaNewspaper, FaFileImport } from 'react-icons/fa';
import { translateText } from '@/lib/translate';
import { NEWS_ITEMS } from '@/lib/constants';

export default function BeritaPage() {
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<NewsArticle> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from('news').select('*').order('date', { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = () => {
    setEditItem({
      title_id: '', title_en: '', description_id: '', description_en: '',
      date: new Date().toISOString().split('T')[0], image_url: '',
    });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editItem) return;
    setSaving(true);
    const title_en = await translateText(editItem.title_id || '');
    const description_en = await translateText(editItem.description_id || '');
    const payload = {
      title_id: editItem.title_id || '',
      title_en: title_en,
      description_id: editItem.description_id || '',
      description_en: description_en,
      date: editItem.date || new Date().toISOString().split('T')[0],
      image_url: editItem.image_url || '',
    };
    if (isNew) { await supabase.from('news').insert(payload); }
    else if (editItem.id) { await supabase.from('news').update(payload).eq('id', editItem.id); }
    setSaving(false); setEditItem(null); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus berita ini?')) return;
    await supabase.from('news').delete().eq('id', id);
    fetchData();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editItem) return;
    setUploading(true);
    const fileName = `news/${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) { alert('Gagal upload: ' + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
    setEditItem({ ...editItem, image_url: publicUrl });
    setUploading(false);
  };

  const handleImport = async () => {
    if (!confirm('Yakin ingin mengimpor berita bawaan?')) return;
    setImporting(true);
    try {
      const payload = NEWS_ITEMS.map((item) => ({
        title_id: item.title_id,
        title_en: item.title_en,
        description_id: item.description_id,
        description_en: item.description_en,
        date: new Date(item.date_en).toISOString().split('T')[0], // Use original date
        image_url: item.image,
      }));
      await supabase.from('news').insert(payload);
      fetchData();
    } catch (e) {
      alert('Gagal impor data');
    }
    setImporting(false);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="animate-spin text-2xl text-accent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-foreground-muted text-sm">Kelola artikel berita kelurahan.</p>
        <div className="flex gap-2">
          {items.length === 0 && (
            <button onClick={handleImport} disabled={importing} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-60">
              {importing ? <FaSpinner className="animate-spin" /> : <FaFileImport />} {importing ? 'Mengimpor...' : 'Import Berita Bawaan'}
            </button>
          )}
          <button onClick={handleAdd} className="px-4 py-2.5 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm">
            <FaPlus /> Tambah Berita
          </button>
        </div>
      </div>

      {editItem && (
        <div className="premium-card p-6 border-2 border-accent/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-lg text-foreground">{isNew ? 'Tambah Berita' : 'Edit Berita'}</h3>
            <button onClick={() => setEditItem(null)} className="p-2 rounded-lg hover:bg-foreground/5 text-foreground-muted"><FaTimes /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Judul</label>
              <input type="text" value={editItem.title_id || ''} onChange={(e) => setEditItem({ ...editItem, title_id: e.target.value })} placeholder="Judul berita"
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Tanggal</label>
              <input type="date" value={editItem.date || ''} onChange={(e) => setEditItem({ ...editItem, date: e.target.value })}
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Konten Berita</label>
              <textarea value={editItem.description_id || ''} onChange={(e) => setEditItem({ ...editItem, description_id: e.target.value })} rows={6} placeholder="Tulis isi berita... (gunakan Enter untuk paragraf baru)"
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground placeholder-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Gambar Sampul</label>
              <input type="file" accept="image/*" onChange={handleImageUpload}
                className="w-full text-sm text-foreground-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer" />
              {uploading && <p className="mt-2 text-xs text-accent flex items-center gap-1"><FaSpinner className="animate-spin" /> Mengupload...</p>}
              {editItem.image_url && (
                <div className="mt-3 relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-foreground/10">
                  <Image src={editItem.image_url} alt="Preview" fill className="object-cover" sizes="400px" />
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

      {/* News List */}
      {items.length === 0 ? (
        <div className="premium-card p-12 text-center">
          <FaNewspaper className="text-3xl mx-auto mb-3 text-foreground-muted/30" />
          <p className="text-foreground-muted">Belum ada berita. Klik &quot;Tambah Berita&quot; untuk memulai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="premium-card group h-full flex flex-col bg-background overflow-hidden hover:-translate-y-2 transition-transform duration-300">
              {/* Image Container */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.title_id || 'Berita'} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/5">
                    <FaNewspaper className="text-5xl text-foreground/20" />
                  </div>
                )}
                
                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md z-10">
                  {formatDate(item.date)}
                </div>

                {/* Action buttons overlaid on top right */}
                <div className="absolute top-4 right-4 z-30 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={() => { setEditItem({ ...item }); setIsNew(false); }} className="w-9 h-9 rounded-full bg-white/95 text-accent flex items-center justify-center hover:bg-white hover:scale-110 shadow-md transition-all" title="Edit">
                    <FaEdit size={14} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="w-9 h-9 rounded-full bg-red-500/95 text-white flex items-center justify-center hover:bg-red-500 hover:scale-110 shadow-md transition-all" title="Hapus">
                    <FaTrash size={14} />
                  </button>
                </div>
                
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none z-20" />
              </div>
              
              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-heading font-bold text-lg text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {item.title_id}
                </h3>
                <p className="text-foreground-light text-sm flex-1 line-clamp-3">
                  {item.description_id}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 opacity-50 cursor-not-allowed">
                  <span className="text-primary font-semibold text-sm">
                    Baca Selengkapnya →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
