import React from 'react';
import { GraduationCap, Github, Layers, ShieldCheck, Heart, Sparkles, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950/95 py-12 px-4 sm:px-6 lg:px-10 2xl:px-14 transition-colors">
      <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
        
        {/* Col 1: Brand & Status (2 cols wide on desktop) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-white">Student AI</span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-full">
                Enterprise Edition
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Autonomous Machine Learning & Explainable AI platform for academic performance forecasting, risk stratification, and prescriptive student intervention.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>FastAPI & ML Engine Online</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">v1.0.0 Production Build</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product Features</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/predict" className="hover:text-cyan-400 transition-colors flex items-center gap-1">Single Prediction Diagnostic</Link></li>
            <li><Link to="/batch" className="hover:text-cyan-400 transition-colors flex items-center gap-1">Batch CSV Inference Engine</Link></li>
            <li><Link to="/analytics" className="hover:text-cyan-400 transition-colors flex items-center gap-1">Multidimensional Analytics</Link></li>
            <li><Link to="/history" className="hover:text-cyan-400 transition-colors flex items-center gap-1">Audit Trail & Records</Link></li>
            <li><Link to="/admin" className="hover:text-cyan-400 transition-colors flex items-center gap-1">Admin Operations</Link></li>
          </ul>
        </div>

        {/* Col 3: ML Pipeline & XAI */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Architecture</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-brand-400" /> Multi-Model Benchmarking</li>
            <li className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-cyan-400" /> SHAP Tree/Linear Attributions</li>
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> LIME Surrogate Rules</li>
            <li className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-400" /> Prescriptive Growth Engine</li>
          </ul>
        </div>

        {/* Col 4: Dataset & Compliance */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dataset & Open Source</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Trained on the UCI Machine Learning Repository Student Performance Dataset (Math & Portuguese Secondary Schools).
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <span className="text-[11px] text-slate-500 font-medium">MIT Licensed • Open Source</span>
          </div>
        </div>

      </div>

      <div className="w-full max-w-[1920px] mx-auto border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          © {new Date().getFullYear()} Student Performance Prediction AI. Built with FastAPI, Scikit-Learn, XGBoost, SHAP, LIME, React 19, TypeScript & Tailwind CSS.
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>Designed for AI/ML Engineering Excellence</span>
        </div>
      </div>
    </footer>
  );
};
