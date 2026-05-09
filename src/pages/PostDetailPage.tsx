import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Post } from '../types';
import { formatDate } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Clock } from 'lucide-react';

export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (data) setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold italic">404 - Post Tidak Ditemukan</h1>
      <Link to="/" className="text-black/40 hover:text-black font-medium underline underline-offset-4">Kembali ke Beranda</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Link to="/" className="inline-flex items-center space-x-2 text-sm font-bold text-black/40 hover:text-black mb-12 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>KEMBALI</span>
      </Link>

      <header className="mb-12">
        <div className="flex items-center space-x-4 text-xs font-bold text-black/30 uppercase tracking-widest mb-4">
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{formatDate(post.created_at)}</span>
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
          {post.title}
        </h1>
        {post.cover_image && (
          <div className="aspect-[21/9] rounded-[2rem] overflow-hidden bg-black/5 mb-12">
            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-black prose-a:font-bold">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
}
