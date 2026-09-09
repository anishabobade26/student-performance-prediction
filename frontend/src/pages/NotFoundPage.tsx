import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-md">
        <div className="inline-flex w-16 h-16 rounded-3xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="font-display font-extrabold text-5xl text-white">404</h1>
        <h2 className="font-display font-bold text-xl text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The requested evaluation route does not exist or has been moved.
        </p>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-600 to-sky-500 text-white shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
