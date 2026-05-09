import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import type { Profile } from '../../types';
import { Save, User as UserIcon } from 'lucide-react';

export default function ProfileAdmin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({
    full_name: '',
    bio: '',
    contact_email: '',
    avatar_url: '',
    github_url: '',
    twitter_url: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert('Profil berhasil diperbarui!');
    } catch (err: any) {
      alert('Gagal memperbarui profil: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse space-y-4">
    <div className="h-8 bg-black/5 w-1/4 rounded"></div>
    <div className="h-32 bg-black/5 w-full rounded-2xl"></div>
  </div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Profil</h1>
        <p className="text-black/40 mt-2">Perbarui data diri yang akan ditampilkan di halaman publik.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Nama Lengkap</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full h-12 bg-black/5 border-transparent focus:border-black/10 focus:bg-white rounded-xl px-4 text-sm font-medium focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Email Kontak</label>
            <input
              type="email"
              value={profile.contact_email}
              onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
              className="w-full h-12 bg-black/5 border-transparent focus:border-black/10 focus:bg-white rounded-xl px-4 text-sm font-medium focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Bio Ringkas</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full h-32 bg-black/5 border-transparent focus:border-black/10 focus:bg-white rounded-xl p-4 text-sm font-medium focus:outline-none transition-all resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">URL Avatar / Foto</label>
          <input
            type="text"
            value={profile.avatar_url}
            onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
            className="w-full h-12 bg-black/5 border-transparent focus:border-black/10 focus:bg-white rounded-xl px-4 text-sm font-medium focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 pt-4 border-t border-black/5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">GitHub URL</label>
            <input
              type="text"
              value={profile.github_url}
              onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
              className="w-full h-12 bg-black/5 border-transparent focus:border-black/10 focus:bg-white rounded-xl px-4 text-sm font-medium focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Twitter URL</label>
            <input
              type="text"
              value={profile.twitter_url}
              onChange={(e) => setProfile({ ...profile, twitter_url: e.target.value })}
              className="w-full h-12 bg-black/5 border-transparent focus:border-black/10 focus:bg-white rounded-xl px-4 text-sm font-medium focus:outline-none transition-all"
            />
          </div>
        </div>

        <button
          disabled={saving}
          className="flex items-center space-x-2 h-14 px-8 bg-black text-white rounded-2xl font-bold tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Profil'}</span>
        </button>
      </form>
    </div>
  );
}
