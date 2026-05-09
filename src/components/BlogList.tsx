import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../types';
import { formatDate } from '../lib/utils';
import { ArrowRight } from 'lucide-react';

export default function BlogList({ posts }: { posts: Post[] }) {
  const navigate = useNavigate();

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center bg-black/[0.02] border-2 border-dashed border-black/10 rounded-3xl">
        <p className="text-black/40 font-medium">Belum ada tulisan terbaru.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post, idx) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          viewport={{ once: true }}
          onClick={() => navigate(`/blog/${post.slug}`)}
          className="group flex flex-col md:flex-row md:items-center justify-between p-8 rounded-3xl bg-white border border-black/5 hover:border-black/20 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        >
          <div className="mb-4 md:mb-0">
            <span className="text-[10px] font-bold text-black/40 uppercase mb-2 block">
              {formatDate(post.created_at)}
            </span>
            <h3 className="text-2xl font-bold group-hover:text-black transition-colors">
              {post.title}
            </h3>
            <p className="text-black/60 mt-2 max-w-xl line-clamp-1">{post.excerpt}</p>
          </div>
          <ArrowRight className="w-6 h-6 text-black/20 group-hover:text-black group-hover:translate-x-2 transition-all" />
        </motion.div>
      ))}
    </div>
  );
}
