import { motion } from 'motion/react';
import type { Profile } from '../types';
import { Github, Twitter, Mail } from 'lucide-react';

export default function Hero({ profile }: { profile: Profile | null }) {
  return (
    <section className="py-20 md:py-32 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-8"
      >
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
          <img
            src={profile?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'}
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-black text-white px-3 py-1 text-xs font-bold rounded-full">
          AVAILABLE
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 uppercase"
      >
        {profile?.full_name || 'Budding Developer'}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xl md:text-2xl text-black/60 max-w-3xl mx-auto mb-10 leading-relaxed font-medium"
      >
        {profile?.bio || 'Full Stack Developer & Technical Writer. Crafting digital experiences with purpose.'}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-center space-x-6"
      >
        {profile?.github_url && (
          <a href={profile.github_url} className="p-3 hover:bg-black/5 rounded-full transition-colors">
            <Github className="w-6 h-6" />
          </a>
        )}
        {profile?.twitter_url && (
          <a href={profile.twitter_url} className="p-3 hover:bg-black/5 rounded-full transition-colors">
            <Twitter className="w-6 h-6" />
          </a>
        )}
        <a href={`mailto:${profile?.contact_email}`} className="p-3 hover:bg-black/5 rounded-full transition-colors">
          <Mail className="w-6 h-6" />
        </a>
      </motion.div>
    </section>
  );
}
