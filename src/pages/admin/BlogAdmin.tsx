import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import type { Post } from '../../types';
import { Plus, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';

export default function BlogAdmin() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    published: false,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase.from('posts').update({
          ...formData,
          updated_at: new Date().toISOString(),
        }).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('posts').insert({
          ...formData,
          author_id: user.id
        });
        if (error) throw error;
      }
      
      resetForm();
      fetchPosts();
    } catch (err: any) {
      alert('Gagal menyimpan postingan: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      cover_image: '',
      published: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (post: Post) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      cover_image: post.cover_image,
      published: post.published,
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus postingan ini?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (!error) fetchPosts();
  };

  const togglePublished = async (post: Post) => {
    const { error } = await supabase
      .from('posts')
      .update({ published: !post.published })
      .eq('id', post.id);
    if (!error) fetchPosts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Blog</h1>
          <p className="text-black/40 mt-2">Tulis tulisan menarik atau bagikan tutorial.</p>
        </div>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className="flex items-center space-x-2 h-12 bg-black text-white px-6 rounded-2xl font-bold transition-transform hover:scale-[1.02]"
        >
          {showForm ? 'Batal' : (
            <><Plus className="w-5 h-5" /><span>Tulis Artikel</span></>
          )}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-12 p-8 bg-black/[0.02] border border-black/5 rounded-[2rem] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Judul Artikel</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                className="w-full h-12 bg-white rounded-xl px-4 text-sm font-medium border border-black/5 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Slug</label>
              <input
                required
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full h-12 bg-white rounded-xl px-4 text-sm font-medium border border-black/5 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Cover Image URL</label>
            <input
              type="text"
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              className="w-full h-12 bg-white rounded-xl px-4 text-sm font-medium border border-black/5 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Ringkasan (Excerpt)</label>
            <textarea
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full h-20 bg-white rounded-xl p-4 text-sm font-medium border border-black/5 focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Isi Konten (Markdown)</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full h-64 bg-white rounded-xl p-6 text-sm font-medium border border-black/5 focus:outline-none resize-none font-mono"
              placeholder="# Judul Artikel\n\nIsi artikel Anda di sini..."
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-5 h-5 rounded border-black/10 text-black focus:ring-black"
            />
            <label htmlFor="published" className="text-sm font-medium text-black/60">Publikasikan artikel ini</label>
          </div>

          <button
            disabled={submitting}
            className="w-full h-14 bg-black text-white rounded-2xl font-bold tracking-tight hover:scale-[1.02] disabled:opacity-50"
          >
            {submitting ? 'Menyimpan...' : (editingId ? 'Perbarui Artikel' : 'Simpan Artikel')}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin opacity-20" /></div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-black/[0.02] border border-black/5 rounded-3xl group">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  {post.published ? (
                    <span className="flex items-center space-x-1 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                      <Check className="w-3 h-3" />
                      <span>Published</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-[10px] font-bold text-black/30 bg-black/5 px-2 py-0.5 rounded-full uppercase">
                      <X className="w-3 h-3" />
                      <span>Draft</span>
                    </span>
                  )}
                </div>
                <p className="text-black/40 text-sm line-clamp-1">{post.excerpt}</p>
              </div>
              
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <button
                  onClick={() => togglePublished(post)}
                  className="p-3 text-black/40 hover:text-black hover:bg-white rounded-xl transition-all"
                  title={post.published ? 'Jadikan Draft' : 'Publikasikan'}
                >
                  {post.published ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => handleEdit(post)}
                  className="p-3 text-black/40 hover:text-black hover:bg-white rounded-xl transition-all"
                  title="Edit"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-3 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Hapus"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && !showForm && (
            <div className="text-center py-20 bg-black/[0.01] border-2 border-dashed border-black/5 rounded-[2rem]">
              <p className="text-black/20 font-bold uppercase tracking-widest text-sm">Belum ada tulisan</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
