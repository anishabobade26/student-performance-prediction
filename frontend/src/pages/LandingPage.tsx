import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  GraduationCap,
  Brain,
  Layers,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  FileSpreadsheet,
  Zap,
  HelpCircle,
  Activity,
  Flame
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { label: 'Champion Model R²', value: '0.8212', desc: 'Random Forest & Ensembles' },
    { label: 'Pass/Fail Accuracy', value: '91.14%', desc: 'Calibrated Classifier Precision' },
    { label: 'Inference Latency', value: '< 20ms', desc: 'FastAPI Vectorized Engine' },
    { label: 'Engineered Features', value: '72', desc: 'Domain & Trajectory Metrics' },
  ];

  const features = [
    {
      icon: Brain,
      title: '9-Model Benchmark Ensemble',
      description: 'Benchmarks Random Forest, Gradient Boosting, XGBoost, LightGBM, Extra Trees, Ridge, Lasso, and Linear models to select the champion architecture.',
      tag: 'Multi-Algorithm'
    },
    {
      icon: Layers,
      title: 'Explainable AI (SHAP & LIME)',
      description: 'Demystifies black-box models with individual SHAP attribution values and LIME local surrogates to pinpoint exact grade drivers and penalties.',
      tag: 'XAI Core'
    },
    {
      icon: Sparkles,
      title: 'Prescriptive AI Growth Strategies',
      description: 'Generates tailored, prioritized learning strategies and lifestyle interventions to bridge concept gaps and boost final exam outcomes.',
      tag: 'Personalization'
    },
    {
      icon: FileSpreadsheet,
      title: 'High-Throughput Batch CSV Engine',
      description: 'Upload hundreds of student records via CSV to perform instantaneous bulk inference and download fully annotated diagnostic reports.',
      tag: 'Bulk Processing'
    },
    {
      icon: BarChart3,
      title: 'Multidimensional Cohort Analytics',
      description: 'Explore correlations between study habits, alcohol consumption, parental education, absences, and academic success with interactive charts.',
      tag: 'Data Intelligence'
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Security & Architecture',
      description: 'Built with JWT authentication, PostgreSQL database models, Redis caching layer, Docker containerization, and automated CI/CD pipelines.',
      tag: 'Production SaaS'
    },
  ];

  const faqs = [
    {
      q: 'Which dataset is used for model training and benchmarking?',
      a: 'The application uses the benchmark UCI Student Performance Dataset (Math and Portuguese secondary school courses), comprising 30+ demographic, social, and academic features with period grades G1, G2, and final target G3.'
    },
    {
      q: 'How does the Explainable AI (SHAP / LIME) module work?',
      a: 'For every single student prediction, the engine runs SHAP Tree/Linear explainers and LIME perturbation surrogates to quantify how each attribute (e.g. study time, past failures, absences) shifted the projected grade relative to the baseline population mean.'
    },
    {
      q: 'Can institutions upload bulk student data via CSV?',
      a: 'Yes. The Batch Inference module accepts CSV files of any size, executes vectorized preprocessor transforms, and outputs a downloadable CSV with predicted grades, risk tiers, and personalized recommendations.'
    },
    {
      q: 'How is the application deployed and containerized?',
      a: 'The full stack is Dockerized with Docker Compose (FastAPI, React, PostgreSQL, Redis, and Nginx reverse proxy), with ready-to-use Render Blueprint and Vercel configurations.'
    }
  ];

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 space-y-28 pb-20 overflow-hidden">
      
      {/* 1. Hero Section (Expansive Full Width) */}
      <section className="relative pt-10 md:pt-16 text-center">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-cyan-600/15 blur-[150px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-brand-600/15 blur-[130px] rounded-full -z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-cyan-500/30 text-xs font-bold text-cyan-300 shadow-xl mb-6"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Next-Gen Academic Performance Intelligence & XAI</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-white max-w-5xl mx-auto leading-[1.08]"
        >
          Predict Grades. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
            Explain Why with AI.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
        >
          An enterprise-grade Machine Learning platform that forecasts student final exam marks ($G3 \in [0, 20]$), stratifies academic risk, pinpoints drivers with SHAP & LIME, and prescribes actionable improvement roadmaps.
        </motion.p>

        {/* CTA Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <Link
            to="/predict"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Live Predictor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm glass-card hover:bg-white/10 text-slate-200 border border-white/10 hover:border-cyan-500/30 transition-all"
          >
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Explore Dashboard</span>
          </Link>
        </motion.div>

        {/* Key Model Stats Grid (4 Wide Columns) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl glass-card border border-white/10 text-center hover:border-cyan-500/40 hover:scale-[1.01] transition-all shadow-xl"
            >
              <div className="font-display font-extrabold text-3xl sm:text-4xl text-cyan-400">
                {s.value}
              </div>
              <div className="text-xs font-bold text-white mt-1.5">{s.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{s.desc}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* 2. Platform Features Grid (3 Columns) */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 px-3.5 py-1 rounded-full border border-cyan-500/25">
            Enterprise Feature Suite
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
            Engineered for Precision & Transparency
          </h2>
          <p className="text-sm text-slate-400">
            Harmonizing predictive ensemble machine learning with transparent Explainable AI and actionable growth checklists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl glass-card border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group hover:scale-[1.01] shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 bg-white/5 px-3 py-1 rounded-md border border-white/5">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Explainable AI Showcase */}
      <section>
        <div className="p-8 sm:p-14 rounded-3xl glass-card border border-white/10 relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
                Explainable AI (XAI)
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
                No More Black-Box Predictions
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Educators and students need to understand <em>why</em> a score was forecast. Our engine calculates SHAP feature attributions and translates mathematical weights into plain-English reasoning.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Positive grade boosts from consistent study hours and strong Period 1/2 scores.',
                  'Penalties highlighted from past class failures or frequent absenteeism.',
                  'Transparent directionality indicators with exact point impact metrics.',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/predict"
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Test with Demo Student Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Preview Card */}
            <div className="p-7 rounded-3xl bg-slate-950/90 border border-white/10 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-xs font-bold text-white">Sample SHAP Waterfall Breakdown</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  Forecast: 15.2 / 20 (Pass)
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300 font-semibold">
                    <span>Period 2 Exam (G2 = 15/20)</span>
                    <span className="font-mono font-bold text-emerald-400">+2.4 pts</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[78%] rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-slate-300 font-semibold">
                    <span>Weekly Study Time (5-10 hrs)</span>
                    <span className="font-mono font-bold text-emerald-400">+1.1 pts</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[55%] rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-slate-300 font-semibold">
                    <span>School Absences (6 days)</span>
                    <span className="font-mono font-bold text-rose-400">-0.8 pts</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[40%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-3xl text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about the architecture and machine learning pipeline.</p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-card border border-white/10 cursor-pointer hover:border-white/20 transition-all"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between text-sm font-bold text-white">
                <span>{faq.q}</span>
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </div>
              {activeFaq === idx && (
                <p className="text-xs text-slate-400 mt-3.5 leading-relaxed border-t border-white/5 pt-3.5">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Final CTA Banner */}
      <section>
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-cyan-600 text-center text-white shadow-2xl relative overflow-hidden">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl max-w-3xl mx-auto tracking-tight">
            Ready to Experience Enterprise Student Performance AI?
          </h2>
          <p className="text-sm text-brand-100 max-w-xl mx-auto mt-4 leading-relaxed">
            Run single student inference, process batch CSV files, and explore explainable AI attributions right now.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/predict"
              className="px-8 py-4 rounded-2xl font-bold text-sm bg-white text-slate-950 shadow-xl hover:bg-slate-100 transition-colors"
            >
              Get Started Now
            </Link>
            <Link
              to="/analytics"
              className="px-8 py-4 rounded-2xl font-bold text-sm bg-brand-900/50 text-white border border-white/20 hover:bg-brand-900/70 transition-colors"
            >
              View Model Benchmarks
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
