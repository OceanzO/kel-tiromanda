'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { GalleryImage } from '@/lib/supabase/types';
import { FaPlus, FaTrash, FaSpinner, FaSave, FaTimes, FaImages, FaFileImport, FaEdit } from 'react-icons/fa';
import { translateText } from '@/lib/translate';
import { GALLERY_CATEGORIES, GALLERY_IMAGES } from '@/lib/constants';

const CATEGORIES = GALLERY_CATEGORIES.filter(c => c.id !== 'all');

const isVideo = (url: string) => {
  if (!url) return false;
  const urlWithoutParams = url.split('?')[0];
  const ext = urlWithoutParams.split('.').pop()?.toLowerCase() || '';
  return ['mp4', 'mov', 'webm', 'ogg', 'quicktime'].includes(ext);
};

export default function GaleriPage() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<GalleryImage> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  
  // Filtering and pagination states
  const [activeCategory, setActiveCategory] = useState('all');

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

  const handleEdit = (item: GalleryImage) => {
    setEditItem(item);
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editItem) return;
    setSaving(true);
    
    const newOrder = editItem.display_order || 0;
    const oldOrder = items.find(i => i.id === editItem.id)?.display_order || 0;
    
    // Auto-shift order logic (only for the same category)
    const categoryItems = items.filter(i => i.category === (editItem.category || 'community'));
    
    if (isNew) {
      // Shift everything >= newOrder up by 1
      const itemsToUpdate = categoryItems.filter(i => i.display_order >= newOrder);
      await Promise.all(itemsToUpdate.map(item => 
        supabase.from('gallery').update({ display_order: item.display_order + 1 }).eq('id', item.id)
      ));
    } else if (newOrder !== oldOrder) {
      if (newOrder < oldOrder) {
        // Shift items between newOrder and oldOrder-1 UP by 1
        const itemsToUpdate = categoryItems.filter(i => i.display_order >= newOrder && i.display_order < oldOrder);
        await Promise.all(itemsToUpdate.map(item => 
          supabase.from('gallery').update({ display_order: item.display_order + 1 }).eq('id', item.id)
        ));
      } else if (newOrder > oldOrder) {
        // Shift items between oldOrder+1 and newOrder DOWN by 1
        const itemsToUpdate = categoryItems.filter(i => i.display_order > oldOrder && i.display_order <= newOrder);
        await Promise.all(itemsToUpdate.map(item => 
          supabase.from('gallery').update({ display_order: item.display_order - 1 }).eq('id', item.id)
        ));
      }
    }

    const payload = {
      image_url: editItem.image_url || '', category: editItem.category || 'community',
      caption_id: editItem.caption_id || '', caption_en: editItem.caption_en || '',
      display_order: newOrder,
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
    let file = e.target.files?.[0];
    if (!file || !editItem) return;
    
    let extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    setUploading(true);
    
    // Convert HEIC/HEIF to JPEG on the client side
    if (extension === 'heic' || extension === 'heif') {
      try {
        let convert = (window as any).heic2any;
        if (!convert) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Gagal memuat pustaka konversi HEIC'));
            document.head.appendChild(script);
          });
          convert = (window as any).heic2any;
        }
        
        const convertedBlob = await convert({ blob: file, toType: 'image/jpeg', quality: 0.8, multiple: true });
        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        file = new File([blob], file.name.replace(/\.heic|\.heif/i, '.jpg'), { type: 'image/jpeg' });
        extension = 'jpg';
      } catch (err: any) {
        console.error('HEIC conversion error:', err);
        // Tampilkan peringatan, tapi JANGAN batalkan unggahan!
        alert('Gagal mengonversi file HEIC secara otomatis. Sistem akan mengunggah format HEIC aslinya.');
        // Lanjutkan unggahan dengan file .heic asli
      }
    }

    const fileName = `gallery/${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) { alert('Gagal upload: ' + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
    setEditItem({ ...editItem, image_url: publicUrl });
    setUploading(false);
  };
  
  const handleImport = async () => {
    if (!confirm('Yakin ingin mengimpor foto bawaan?')) return;
    setImporting(true);
    try {
      const payload = GALLERY_IMAGES.map((img, i) => ({
        image_url: img.src,
        category: img.category,
        caption_id: img.caption_id,
        caption_en: img.caption_en,
        display_order: i + 1
      }));
      await supabase.from('gallery').insert(payload);
      fetchData();
    } catch (e) {
      alert('Gagal impor data');
    }
    setImporting(false);
  };

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);
    
  const displayedItems = filteredItems;

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="animate-spin text-2xl text-accent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-foreground-muted text-sm">Kelola galeri foto kelurahan.</p>
        <div className="flex gap-2">
          {items.length === 0 && (
            <button onClick={handleImport} disabled={importing} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-60">
              {importing ? <FaSpinner className="animate-spin" /> : <FaFileImport />} {importing ? 'Mengimpor...' : 'Import Foto Bawaan'}
            </button>
          )}
          <button onClick={handleAdd} className="px-4 py-2.5 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm">
            <FaPlus /> Tambah Foto
          </button>
        </div>
      </div>
      
      {/* Category Filter */}
      {items.length > 0 && !editItem && (
        <div className="flex flex-wrap gap-2 mb-6 border-b border-foreground/10 pb-4">
          {GALLERY_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === category.id
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-background-alt text-foreground hover:bg-foreground/5 border border-foreground/10'
              }`}
            >
              {category.label_id}
            </button>
          ))}
        </div>
      )}

      {editItem && (
        <div className="premium-card p-6 border-2 border-accent/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-lg text-foreground">{isNew ? 'Tambah Foto' : 'Edit Foto'}</h3>
            <button onClick={() => setEditItem(null)} className="p-2 rounded-lg hover:bg-foreground/5 text-foreground-muted"><FaTimes /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Kategori</label>
              <select value={editItem.category || 'community'} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm">
                {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label_id}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Urutan</label>
              <input type="number" value={editItem.display_order !== undefined && editItem.display_order !== null ? editItem.display_order : ''} onChange={(e) => setEditItem({ ...editItem, display_order: e.target.value === '' ? 0 : Number(e.target.value) })}
                className="w-full px-4 py-3 bg-background-alt border border-foreground/10 rounded-xl text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">Upload Foto/Video</label>
              <input type="file" accept="image/jpeg, image/png, image/webp, .heic, .mov, video/mp4, video/quicktime" onChange={handleImageUpload}
                className="w-full text-sm text-foreground-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer" />
              {uploading && <p className="mt-2 text-xs text-accent flex items-center gap-1"><FaSpinner className="animate-spin" /> Sedang memproses dan mengupload...</p>}
              {editItem.image_url && (
                <div className="mt-3 relative w-48 aspect-video rounded-xl overflow-hidden border border-foreground/10 bg-black/10">
                  {isVideo(editItem.image_url) ? (
                    <video src={editItem.image_url} className="w-full h-full object-cover" controls muted />
                  ) : (
                    <Image src={editItem.image_url} alt="Preview" fill sizes="200px" className="object-cover" />
                  )}
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
      ) : !editItem && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayedItems.map((item) => (
              <div key={item.id} className="premium-card overflow-hidden group relative">
                <div className="relative aspect-video bg-background-alt">
                  {item.image_url && isVideo(item.image_url) ? (
                    <video src={item.image_url} className="w-full h-full object-cover" muted loop playsInline autoPlay={false} />
                  ) : item.image_url ? (
                    <Image src={item.image_url} alt={item.caption_id || ''} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover" />
                  ) : null}
                  
                  {/* Badge Nomor Urut */}
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md z-10 backdrop-blur-sm shadow-sm pointer-events-none">
                    #{item.display_order || 0}
                  </div>

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3">
                    <button onClick={() => handleEdit(item)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2.5 rounded-full bg-blue-500/90 text-white hover:bg-blue-500 hover:scale-110 transform">
                      <FaEdit className="text-sm" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2.5 rounded-full bg-red-500/90 text-white hover:bg-red-500 hover:scale-110 transform">
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-foreground truncate">{item.caption_id}</p>
                  <span className="text-[10px] text-foreground-muted uppercase tracking-wider">
                    {GALLERY_CATEGORIES.find(c => c.id === item.category)?.label_id || item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {displayedItems.length === 0 && (
             <div className="p-12 text-center border-2 border-dashed border-foreground/10 rounded-xl mt-4">
               <p className="text-foreground-muted">Tidak ada foto di kategori ini.</p>
             </div>
          )}
        </>
      )}
    </div>
  );
}
