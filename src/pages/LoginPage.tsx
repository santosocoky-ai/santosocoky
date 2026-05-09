import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/admin/profile');
    } catch (err: any) {
      setError(err.message || 'Gagal login. Silakan cek email & password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2rem] p-10 border border-black/5 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Admin Portofolio</h1>
          <p className="text-black/40 text-sm mt-1">Silakan masuk untuk mengelola konten.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-black/40 uppercase mb-2 block tracking-widest pl-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 bg-black/5 rounded-2xl pl-12 pr-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all lg:text-base border border-transparent focus:border-black/10"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-black/40 uppercase mb-2 block tracking-widest pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-black/5 rounded-2xl pl-12 pr-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all lg:text-base border border-transparent focus:border-black/10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full h-14 bg-black text-white rounded-2xl font-bold tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all disabled:bg-black/40 disabled:scale-100"
          >
            {loading ? 'Masuk...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
