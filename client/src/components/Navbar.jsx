import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Edit3, Mic, Volume2, Grid, Sparkles } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Từ Vựng (Vocab)', icon: BookOpen },
    { to: '/kana', label: 'Bảng Chữ Cái', icon: Grid },
    { to: '/kanji', label: 'Kanji Dojo (Viết)', icon: Edit3 },
    { to: '/reading', label: 'Luyện Đọc', icon: Sparkles },
    { to: '/speaking', label: 'Luyện Nói (Shadowing)', icon: Mic }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            日
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-tight flex items-center gap-2">
              JLPT Master
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-semibold border border-indigo-200">
                N5 → N3
              </span>
            </div>
            <p className="text-xs text-slate-500">MERN Stack 4-Skills Platform</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SWE Mode: Active
          </div>
        </div>
      </div>
    </header>
  );
}
