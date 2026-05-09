import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import type { Project } from '../../types';
import { Plus, Trash2, ExternalLink, Github, Loader2 } from 'lucide-react';

export default function PortfolioAdmin() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    repo_url: '',
    live_url: '',
    tech_stack: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      const { error } = await supabase.from('projects').insert({
        ...formData,
        tech_stack: formData.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
        user_id: user.id
      });
      if (error) throw error;
      
      setFormData({
        title: '',
        description: '',
        image_url: '',
        repo_url: '',
        live_url: '',
        tech_stack: '',
      });
      setShowForm(false);
      fetchProjects();
    } catch (err: any) {
      alert('Gagal menambah proyek: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus proyek ini?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) fetchProjects();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Portofolio</h1>
          <p className="text-black/40 mt-2">Kelola daftar karya yang ingin ditampilkan.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 h-12 bg-black text-white px-6 rounded-2xl font-bold transition-transform hover:scale-[1.02]"
        >
          {showForm ? 'Batal' : (
            <><Plus className="w-5 h-5" /><span>Tambah Proyek</span></>
          )}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-12 p-8 bg-black/[0.02] border border-black/5 rounded-[2rem] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Judul Proyek</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-12 bg-white rounded-xl px-4 text-sm font-medium border border-black/5 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">URL Gambar</label>
              <input
                required
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full h-12 bg-white rounded-xl px-4 text-sm font-medium border border-black/5 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Deskripsi</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-24 bg-white rounded-xl p-4 text-sm font-medium border border-black/5 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Repo URL</label>
              <input
                type="text"
                value={formData.repo_url}
                onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                className="w-full h-12 bg-white rounded-xl px-4 text-sm font-medium border border-black/5 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Live URL</label>
              <input
                type="text"
                value={formData.live_url}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                className="w-full h-12 bg-white rounded-xl px-4 text-sm font-medium border border-black/5 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Tech Stack (pisahkan dengan koma)</label>
            <input
              type="text"
              placeholder="React, Tailwind, Supabase"
              value={formData.tech_stack}
              onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
              className="w-full h-12 bg-white rounded-xl px-4 text-sm font-medium border border-black/5 focus:outline-none"
            />
          </div>

          <button
            disabled={submitting}
            className="w-full h-14 bg-black text-white rounded-2xl font-bold tracking-tight hover:scale-[1.02] disabled:opacity-50"
          >
            {submitting ? 'Menyimpan...' : 'Simpan Proyek'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin opacity-20" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-black/[0.02] border border-black/5 rounded-3xl group">
              <div className="flex items-center space-x-6 w-full">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black/5 flex-shrink-0">
                  <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{proj.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    {proj.repo_url && <a href={proj.repo_url} className="text-black/40 hover:text-black mt-1"><Github className="w-4 h-4" /></a>}
                    {proj.live_url && <a href={proj.live_url} className="text-black/40 hover:text-black mt-1"><ExternalLink className="w-4 h-4" /></a>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(proj.id)}
                className="mt-4 md:mt-0 p-3 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {projects.length === 0 && !showForm && (
            <div className="text-center py-20 bg-black/[0.01] border-2 border-dashed border-black/5 rounded-[2rem]">
              <p className="text-black/20 font-bold uppercase tracking-widest text-sm">Belum ada data</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
