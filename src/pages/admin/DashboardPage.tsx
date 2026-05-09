import { Outlet, NavLink } from 'react-router-dom';
import { User, Briefcase, FileText, LayoutDashboard } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function DashboardPage() {
  const menuItems = [
    { name: 'Profil', href: '/admin/profile', icon: User },
    { name: 'Portofolio', href: '/admin/portfolio', icon: Briefcase },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 space-y-2">
          <div className="mb-6 px-4 py-2 bg-black/5 rounded-2xl">
            <h2 className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-black/40">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </h2>
          </div>
          <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {menuItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                    isActive 
                      ? "bg-black text-white shadow-xl shadow-black/10" 
                      : "text-black/60 hover:bg-black/5"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 bg-white rounded-[2rem] border border-black/5 p-8 lg:p-12 shadow-sm min-h-[60vh]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
