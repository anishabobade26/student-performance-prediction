import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn, Sparkles, User, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginAsDemo } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      error('Missing fields', 'Please enter your username and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      await login({ username, password });
      success('Welcome back!', 'Successfully signed in to Student AI.');
      navigate('/dashboard');
    } catch (err: any) {
      error('Authentication Failed', err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'student') => {
    setIsSubmitting(true);
    try {
      await loginAsDemo(role);
      success(`Signed in as Demo ${role === 'admin' ? 'Admin' : 'Student'}!`, 'Loaded evaluation session.');
      navigate('/dashboard');
    } catch (err: any) {
      error('Demo Login Error', 'Could not establish demo session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 mb-2">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Sign In to Student AI</h1>
          <p className="text-xs text-slate-400">Access performance forecasts, batch predictions, and model analytics</p>
        </div>

        {/* 1-Click Demo Evaluation Buttons */}
        <div className="p-4 rounded-2xl glass-card border border-brand-500/20 space-y-2.5 bg-brand-500/5">
          <span className="text-[11px] font-semibold text-brand-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Quick Evaluator Login (1-Click)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              disabled={isSubmitting}
              className="py-2 px-3 rounded-xl text-xs font-semibold bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 transition-all text-center"
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('student')}
              disabled={isSubmitting}
              className="py-2 px-3 rounded-xl text-xs font-semibold bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 transition-all text-center"
            >
              Demo Student
            </button>
          </div>
        </div>

        {/* Standard Login Form */}
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl glass-card border border-white/10 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-600 to-sky-500 text-white shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 font-semibold hover:underline">
            Create account
          </Link>
        </p>

      </div>
    </div>
  );
};
