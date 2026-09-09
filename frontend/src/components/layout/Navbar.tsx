import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  LayoutDashboard,
  BrainCircuit,
  FileSpreadsheet,
  BarChart3,
  History,
  ShieldCheck,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  LogIn,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Predict AI', path: '/predict', icon: BrainCircuit },
    { name: 'Batch Inference', path: '/batch', icon: FileSpreadsheet },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'History', path: '/history', icon: History },
  ];

  if (user?.is_admin) {
    navLinks.push({ name: 'Admin Console', path: '/admin', icon: ShieldCheck });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur-2xl bg-slate-950/85 transition-colors">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 group-hover:shadow-brand-500/50 transition-all">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Student AI
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-brand-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                PRO SaaS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block">Academic Performance Intelligence & XAI</p>
          </div>
        </Link>

        {/* Center Nav Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-brand-500/20 text-cyan-300 border border-brand-500/40 shadow-sm shadow-brand-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle & User Menu */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Live System Status Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ML Engine Active</span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-white">{user?.full_name || user?.username}</span>
                <span className="text-[10px] font-medium text-slate-400">{user?.is_admin ? 'Super Admin' : 'Researcher'}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/predict"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 text-white hover:opacity-90 shadow-lg shadow-brand-500/25 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Demo</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
