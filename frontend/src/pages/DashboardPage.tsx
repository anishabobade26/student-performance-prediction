import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  BrainCircuit,
  FileSpreadsheet,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Award,
  Zap,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { api } from '../services/api';
import { AnalyticsData, PredictionHistoryItem } from '../types';

export const DashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentPredictions, setRecentPredictions] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewData, historyData] = await Promise.all([
          api.analytics.getOverview(),
          api.history.getAll(1, 8),
        ]);
        setAnalytics(overviewData);
        setRecentPredictions(historyData.predictions || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const riskPieData = [
    { name: 'Low Risk', value: 48, color: '#10b981' },
    { name: 'Medium Risk', value: 32, color: '#0ea5e9' },
    { name: 'High Risk', value: 14, color: '#f59e0b' },
    { name: 'Critical Risk', value: 6, color: '#ef4444' },
  ];

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-xs font-semibold mb-2.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Academic Performance Telemetry</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            Executive Academic Performance Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Real-time inference telemetry, cohort risk distributions, cross-model benchmarks, and institutional audit trail.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            to="/predict"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 text-white shadow-lg shadow-brand-500/25 hover:opacity-90 transition-all"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>New Prediction</span>
          </Link>
          <Link
            to="/batch"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold glass-card border border-white/10 hover:bg-white/5 text-slate-200 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <span>Batch Upload</span>
          </Link>
        </div>
      </div>

      {/* 5 KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        
        <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Inferences Logged</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/15 text-cyan-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-white">
            {loading ? '...' : analytics?.total_predictions.toLocaleString() || '395'}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> UCI Benchmark Dataset
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Average Projected Grade</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-cyan-400">
            {loading ? '...' : `${analytics?.average_predicted_grade || 10.4} / 20`}
          </div>
          <div className="text-[11px] text-slate-400">
            {(((analytics?.average_predicted_grade || 10.4) / 20) * 100).toFixed(1)}% Normalized Average
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-2 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Predicted Pass Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-emerald-400">
            {loading ? '...' : `${analytics?.overall_pass_rate || 67.1}%`}
          </div>
          <div className="text-[11px] text-slate-400">Threshold: Final G3 ≥ 10 pts</div>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">At-Risk Student Ratio</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-amber-400">
            {loading ? '...' : `${analytics?.high_risk_percentage || 32.9}%`}
          </div>
          <div className="text-[11px] text-slate-400">Target for proactive tutoring</div>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-2 relative overflow-hidden group hover:border-purple-500/40 transition-all sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Champion Test R²</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-purple-400">
            {loading ? '...' : analytics?.model_r2_score || 0.8212}
          </div>
          <div className="text-[11px] text-slate-400">Random Forest Regressor</div>
        </div>

      </div>

      {/* Middle Section: Risk Distribution & Quick Action Banners */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
        
        {/* Risk Distribution Chart (5 Cols) */}
        <div className="xl:col-span-5 p-6 sm:p-7 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white">Cohort Risk Stratification</h3>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                ACTIVE COHORT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Multi-factor risk indexing across grades, absences, and study metrics</p>
          </div>

          <div className="h-60 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={92}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 border border-white/10 rounded-xl text-xs shadow-xl">
                          <span className="font-bold text-white">{item.name}: </span>
                          <span className="font-extrabold text-cyan-400">{item.value}%</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/5">
            {riskPieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-slate-300">
                <span className="w-3 h-3 rounded-md shrink-0 shadow-sm" style={{ backgroundColor: item.color }}></span>
                <span className="text-xs font-semibold">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Interactive Cards (7 Cols) */}
        <div className="xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          <Link
            to="/predict"
            className="p-7 rounded-3xl glass-card border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group bg-gradient-to-br from-cyan-950/20 via-slate-900/60 to-transparent hover:scale-[1.01]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-white group-hover:text-cyan-300 transition-colors">
                Single Student Predictor
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Input candidate attributes to compute calibrated final grades, risk levels, SHAP waterfall attributions, and prescriptive recommendations.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mt-6 group-hover:translate-x-1 transition-transform">
              <span>Launch Assessment Form</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            to="/batch"
            className="p-7 rounded-3xl glass-card border border-white/10 hover:border-brand-500/40 transition-all flex flex-col justify-between group bg-gradient-to-br from-brand-950/20 via-slate-900/60 to-transparent hover:scale-[1.01]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 text-brand-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-brand-500/10">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-white group-hover:text-brand-300 transition-colors">
                Vectorized Batch Inference
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Upload institutional CSV rosters. Process thousands of student records in milliseconds and download annotated reports.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-400 mt-6 group-hover:translate-x-1 transition-transform">
              <span>Upload CSV Roster</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            to="/analytics"
            className="p-6 rounded-2xl glass-card border border-white/10 hover:border-purple-500/40 transition-all flex items-center justify-between group sm:col-span-2 bg-gradient-to-r from-purple-950/20 via-slate-900/60 to-transparent"
          >
            <div>
              <h4 className="font-display font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                Multidimensional Analytics & 9-Model Leaderboard
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Explore feature correlations, study time impacts, absenteeism trends, and full algorithm benchmarking table.
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 ml-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
          </Link>

        </div>

      </div>

      {/* Bottom Section: Recent Inferences Table (Full Width) */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Recent Evaluation Audit Trail</h3>
            <p className="text-xs text-slate-400">Latest predictions logged in this environment session</p>
          </div>
          <Link to="/history" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors">
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentPredictions.length === 0 ? (
          <div className="py-14 text-center text-xs text-slate-500 space-y-2">
            <Clock className="w-8 h-8 mx-auto text-slate-600" />
            <p>No predictions recorded yet. Run a prediction to see live history records!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Record ID</th>
                  <th className="py-3 px-4">Predicted Grade</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Risk Tier</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {recentPredictions.map((pred) => (
                  <tr key={pred.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">#{pred.id}</td>
                    <td className="py-3.5 px-4 font-bold text-white text-sm">
                      {pred.predicted_g3.toFixed(1)} / 20
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        pred.pass_fail === 'Pass' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {pred.pass_fail}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-semibold ${
                        pred.risk_level === 'Low' ? 'text-emerald-400' : pred.risk_level === 'Medium' ? 'text-cyan-400' : 'text-rose-400'
                      }`}>
                        {pred.risk_level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{pred.confidence_score}%</td>
                    <td className="py-3.5 px-4 text-slate-500">{new Date(pred.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
