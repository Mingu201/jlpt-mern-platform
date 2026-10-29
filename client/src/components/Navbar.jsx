import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Edit3, Mic, Grid, Sparkles, Sun, Moon, GraduationCap, Flame, User, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAuthModal }) {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { to: '/classroom', label: 'Lớp Học 1-1', icon: GraduationCap, highlight: true },
    { to: '/', label: 'Từ Vựng', icon: BookOpen },
    { to: '/kana', label: 'Bảng Chữ Cái', icon: Grid },
    { to: '/kanji', label: 'Kanji Dojo', icon: Edit3 },
    { to: '/reading', label: 'Luyện Đọc', icon: Sparkles },
    { to: '/speaking', label: 'Luyện Nói', icon: Mic }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            日
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
              JLPT Master
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800">
                N5 → N3
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Classroom & SRS Platform</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  item.highlight
                    ? isActive
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800/60'
                    : isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 pl-3 pr-1 py-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400" title="Chuỗi ngày học liên tục (Streak)">
                <Flame size={14} className="fill-amber-500 text-amber-500 animate-pulse" />
                <span>{user.streak || 1}d</span>
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[90px] truncate">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
            >
              Đăng Nhập
            </button>
          )}

          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
