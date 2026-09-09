import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Brain,
  ShieldCheck,
  Layers,
  Award,
  Users,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { api } from '../services/api';
import { AnalyticsData } from '../types';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.analytics.getOverview();
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <BarChart3 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Aggregating cohort statistical analytics & benchmark metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-2.5">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span>Multidimensional Academic Data Intelligence</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            Statistical Insights & 9-Model Benchmark Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Correlate demographic distributions, study habits, and absenteeism against Portuguese secondary school performance with cross-model comparative metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-purple-300 bg-purple-500/15 px-3.5 py-1.5 rounded-xl border border-purple-500/30 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Champion: Random Forest (R² = {data.model_r2_score})</span>
          </span>
        </div>
      </div>

      {/* Row 1: Grade Distribution & Study Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Grade Distribution */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Final Grade (G3) Cohort Distribution
              </h3>
              <p className="text-xs text-slate-400">Frequency breakdown across standard performance tiers</p>
            </div>
            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
              0-20 SCALE
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.grade_distribution} margin={{ top: 10, right: 15, left: -10, bottom: 20 }}>
                <XAxis dataKey="grade_range" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900/95 border border-white/10 rounded-xl text-xs shadow-xl backdrop-blur-md">
                          <p className="font-bold text-white">{item.grade_range}</p>
                          <p className="text-cyan-400 font-extrabold mt-1">{item.count} students ({item.percentage}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {data.grade_distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : index === 4 ? '#10b981' : '#0ea5e9'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Study Time vs Average Grade */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Weekly Study Time vs Mean Grade
              </h3>
              <p className="text-xs text-slate-400">Impact of dedicated study hours on average score and pass rate</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              HOURS ALLOCATION
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.study_time_analysis} margin={{ top: 10, right: 15, left: -10, bottom: 20 }}>
                <XAxis dataKey="study_time_category" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 20]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900/95 border border-white/10 rounded-xl text-xs space-y-1 shadow-xl backdrop-blur-md">
                          <p className="font-bold text-white">{item.study_time_category}</p>
                          <p className="text-cyan-400 font-bold">Avg Grade: {item.average_grade} / 20</p>
                          <p className="text-emerald-400 font-semibold">Pass Rate: {item.pass_rate}%</p>
                          <p className="text-slate-400 text-[10px]">Sample Size: {item.student_count} students</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="average_grade" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Absences vs Failure Rate & Top Feature Correlations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Absences Impact Line Chart */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                School Absences vs Failure Rate
              </h3>
              <p className="text-xs text-slate-400">Direct relationship between absenteeism volume and failure probability</p>
            </div>
            <span className="text-[10px] font-bold text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
              ABSENTEEISM
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.absences_analysis} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="absence_bucket" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900/95 border border-white/10 rounded-xl text-xs space-y-1 shadow-xl backdrop-blur-md">
                          <p className="font-bold text-white">{item.absence_bucket}</p>
                          <p className="text-amber-400 font-bold">Avg Score: {item.average_grade} / 20</p>
                          <p className="text-rose-400 font-semibold">Failure Rate: {item.failure_rate}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="failure_rate" stroke="#ef4444" strokeWidth={3} dot={{ r: 5, fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Feature Correlations List */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Strongest Correlations with Final Grade (G3)
              </h3>
              <p className="text-xs text-slate-400">Pearson correlation ranking across academic and lifestyle attributes</p>
            </div>
            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
              PEARSON R
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {data.top_correlations.map((corr, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>{corr.feature_x}</span>
                  <span className={`font-mono font-bold ${corr.correlation >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {corr.correlation >= 0 ? '+' : ''}{corr.correlation.toFixed(3)}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${corr.correlation >= 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-600 to-red-500'}`}
                    style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Demographics Summary Grid (6 Cols) */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-4">
        <div>
          <h3 className="font-display font-bold text-lg text-white">
            Cohort Demographics Summary
          </h3>
          <p className="text-xs text-slate-400">Dataset breakdown across gender, geography, and institution</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-slate-400 font-semibold">Female Students</span>
            <div className="text-2xl font-extrabold text-white">{data.demographics.female_count}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-slate-400 font-semibold">Male Students</span>
            <div className="text-2xl font-extrabold text-white">{data.demographics.male_count}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-slate-400 font-semibold">Urban Residents</span>
            <div className="text-2xl font-extrabold text-cyan-400">{data.demographics.urban_count}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-slate-400 font-semibold">Rural Residents</span>
            <div className="text-2xl font-extrabold text-amber-400">{data.demographics.rural_count}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-slate-400 font-semibold">Gabriel Pereira (GP)</span>
            <div className="text-2xl font-extrabold text-brand-400">{data.demographics.school_gp_count}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-slate-400 font-semibold">Mousinho Silveira (MS)</span>
            <div className="text-2xl font-extrabold text-purple-400">{data.demographics.school_ms_count}</div>
          </div>
        </div>
      </div>

      {/* Row 4: Multi-Model Benchmark Leaderboard Table (Full Width) */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Multi-Model Machine Learning Leaderboard
              </h3>
              <p className="text-xs text-slate-400">
                Ranked by test set R² performance, RMSE, MAE, 5-Fold Cross-Validation, and training runtime
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Algorithm</th>
                <th className="py-3.5 px-4">Test R² Score</th>
                <th className="py-3.5 px-4">Test RMSE</th>
                <th className="py-3.5 px-4">Test MAE</th>
                <th className="py-3.5 px-4">5-Fold CV Mean</th>
                <th className="py-3.5 px-4">Fit Latency</th>
                <th className="py-3.5 px-4">Deployment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {data.leaderboard.map((model, idx) => (
                <tr key={idx} className={`hover:bg-white/[0.02] transition-colors ${model.is_champion ? 'bg-cyan-500/10' : ''}`}>
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    {model.is_champion && <Award className="w-4 h-4 text-amber-400 shrink-0" />}
                    <span>{model.model_name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">{model.r2_score.toFixed(4)}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{model.rmse.toFixed(4)}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{model.mae.toFixed(4)}</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-300 font-semibold">{model.cv_r2_mean.toFixed(4)}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">{model.fit_time_seconds.toFixed(3)}s</td>
                  <td className="py-3.5 px-4">
                    {model.is_champion ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Champion Model
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium">Evaluated Benchmark</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
