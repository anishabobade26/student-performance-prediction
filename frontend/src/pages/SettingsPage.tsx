import React from 'react';
import { Settings, User, Moon, Sun, Shield, Database, Cpu, Sparkles, CheckCircle2, Server } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success } = useNotification();

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold mb-2.5">
          <Settings className="w-4 h-4 text-cyan-400" />
          <span>System & Workspace Configuration</span>
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
          System & User Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Manage authenticated account credentials, appearance themes, telemetry configurations, and ML engine runtime parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User Profile Card */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-5">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Active User Profile</h3>
              <p className="text-xs text-slate-400">Current authenticated session details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-slate-400 font-semibold">Username</label>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-mono font-bold">
                {user?.username || 'Guest / Evaluator'}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 font-semibold">Email Address</label>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200">
                {user?.email || 'evaluator@studentai.io'}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 font-semibold">System Role</label>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-cyan-300 font-bold">
                {user?.is_admin ? 'Super Administrator' : 'Student / Researcher'}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 font-semibold">Session Status</label>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-emerald-400 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active JWT Session</span>
              </div>
            </div>
          </div>
        </div>

        {/* Theme & Aesthetics Card */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-5">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-cyan-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Visual Theme & Aesthetics</h3>
              <p className="text-xs text-slate-400">Toggle interface display palette</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/5 text-xs">
            <div>
              <span className="font-bold text-white text-sm">Theme Mode</span>
              <p className="text-slate-400 mt-0.5">Switch between Cyber Dark Glassmorphism and Clean Light mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all shrink-0"
            >
              Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>

        {/* ML Inference Runtime Environment */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-5 lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">ML Model Inference Engine & Dataset Specs</h3>
              <p className="text-xs text-slate-400">Production pipeline hyperparameters and architecture components</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-slate-400 font-semibold">Active Benchmark Dataset</span>
              <div className="text-sm font-bold text-white">UCI Student Performance (Math Course)</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-slate-400 font-semibold">Backend Framework</span>
              <div className="text-sm font-bold text-cyan-300">FastAPI Async & Python 3.12+</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-slate-400 font-semibold">Explainability Engine</span>
              <div className="text-sm font-bold text-emerald-400">SHAP TreeExplainer & LIME Tabular</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
