import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import type { Profile, Project, Post } from '../types';
import { AlertCircle } from 'lucide-react';
import PortfolioGrid from '../components/PortfolioGrid';
import BlogList from '../components/BlogList';
import Hero from '../components/Hero';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [profRes, projRes, postRes] = await Promise.all([
          supabase.from('profiles').select('*').single(),
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('posts').select('*').eq('published', true).order('created_at', { ascending: false }).limit(3)
        ]);

        if (profRes.data) setProfile(profRes.data);
        if (projRes.data) setProjects(projRes.data);
        if (postRes.data) setPosts(postRes.data);
      } catch (error) {
        console.error('Error fetching landing data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setLoading(false);
    } else {
      fetchData();
    }
  }, []);

  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-black/20" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Konfigurasi Diperlukan</h1>
        <p className="max-w-md text-black/60 mb-8 leading-relaxed">
          Silakan tambahkan <code className="bg-black/5 px-2 py-1 rounded">VITE_SUPABASE_URL</code> dan <code className="bg-black/5 px-2 py-1 rounded">VITE_SUPABASE_ANON_KEY</code> di panel <strong>Secrets</strong> agar data portofolio bisa muncul.
        </p>
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800 text-sm font-medium">
          Note: Jangan lupa jalankan SQL script di dashboard Supabase Anda.
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Hero profile={profile} />
      
      <section id="portfolio" className="py-20 border-t border-black/5">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Karya Terpilih</h2>
          <p className="text-black/50 mt-2">Daftar proyek yang pernah saya kerjakan.</p>
        </div>
        <PortfolioGrid projects={projects} />
      </section>

      <section id="blog" className="py-20 border-t border-black/5">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Tulisan Terbaru</h2>
          <p className="text-black/50 mt-2">Berbagi pemikiran dan tutorial seputar teknologi.</p>
        </div>
        <BlogList posts={posts} />
      </section>

      <section id="contact" className="py-20 border-t border-black/5 text-center">
        <h2 className="text-6xl font-bold tracking-tighter mb-8">HUBUNGI SAYA</h2>
        <p className="text-2xl text-black/60 max-w-2xl mx-auto leading-relaxed mb-12">
          Punya ide menarik atau ingin berkolaborasi? Jangan ragu untuk menyapa.
        </p>
        <a 
          href={`mailto:${profile?.contact_email || 'hello@example.com'}`}
          className="inline-flex h-16 items-center justify-center px-10 rounded-full bg-black text-white text-xl font-medium hover:scale-105 transition-transform"
        >
          Kirim Email
        </a>
      </section>
    </div>
  );
}
