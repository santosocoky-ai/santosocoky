import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { LayoutDashboard, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdminPath = location.pathname.startsWith('/admin');

  const navLinks = [
    { name: 'Karya', href: '#portfolio' },
    { name: 'Blog', href: '#blog' },
    { name: 'Kontak', href: '#contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold tracking-tighter">
              DEV.PORTFOLIO
            </Link>
            {!isAdminPath && (
              <div className="hidden md:flex space-x-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-black/60 hover:text-black transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/admin/profile"
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-full transition-all",
                    isAdminPath ? "bg-black text-white" : "hover:bg-black/5 border border-black/10"
                  )}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/60 hover:text-red-500"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-black/40 hover:text-black transition-colors"
              >
                Admin Area
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
