import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  BrainCircuit,
  Sparkles,
  ArrowLeft,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  HelpCircle,
  Clock,
  ShieldCheck,
  Award,
  Zap,
  Activity
} from 'lucide-react';
import { PredictionResult } from '../types';
import { ScoreGauge } from '../components/charts/ScoreGauge';
import { RiskMeter } from '../components/charts/RiskMeter';
import { FeatureImportanceChart } from '../components/charts/FeatureImportanceChart';
import { RecommendationsCard } from '../components/charts/RecommendationsCard';
import { ExportModal } from '../components/charts/ExportModal';

export const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    if (location.state?.result) {
      setResult(location.state.result);
    } else {
      const saved = sessionStorage.getItem('student_ai_last_result');
      if (saved) {
        try {
          setResult(JSON.parse(saved));
        } catch (e) {
          navigate('/predict');
        }
      } else {
        navigate('/predict');
      }
    }
  }, [location, navigate]);

  if (!result) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <BrainCircuit className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Retrieving inference diagnostics & SHAP explanations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-8 space-y-8">
      
      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/predict"
            className="p-3 rounded-2xl glass-card hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all"
            title="Return to Predict Form"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                Diagnostic Prediction & Explainability Report
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Inference Latency: {result.latency_ms}ms
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Active Regressor: <span className="text-cyan-300 font-semibold">{result.champion_regressor}</span> • Calibrated Classifier: <span className="text-brand-300 font-semibold">{result.champion_classifier}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold glass-card hover:bg-white/10 text-slate-200 border border-white/10 hover:border-cyan-500/30 transition-all"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Export PDF / Print</span>
          </button>
          <Link
            to="/predict"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 text-white shadow-lg shadow-brand-500/25 hover:opacity-90 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Prediction</span>
          </Link>
        </div>
      </div>

      {/* Row 1: 4 Key Diagnostic KPI Cards spanning across full width */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Score Gauge */}
        <ScoreGauge
          score={result.predicted_g3}
          percentage={result.predicted_percentage}
          tier={result.performance_tier}
          passFail={result.pass_fail}
        />

        {/* Risk Meter */}
        <RiskMeter
          riskLevel={result.risk_level}
          confidenceScore={result.confidence_score}
        />

        {/* Statistical Trajectory Card */}
        <div className="p-6 glass-card rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Statistical Cohort Trajectory</span>
            </div>
            <h4 className="font-display font-bold text-lg text-white">
              {result.performance_tier} Band
            </h4>
          </div>

          <div className="space-y-2 text-xs divide-y divide-white/5">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Pass Probability</span>
              <span className="font-bold text-emerald-400">{(result.pass_probability * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Baseline Expected Mean</span>
              <span className="font-semibold text-slate-300">{result.baseline_expected_value} / 20</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Net Score Deviation</span>
              <span className={`font-bold ${result.predicted_g3 >= result.baseline_expected_value ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.predicted_g3 >= result.baseline_expected_value ? '+' : ''}
                {(result.predicted_g3 - result.baseline_expected_value).toFixed(2)} pts
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Evaluated at {new Date(result.created_at).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Model Architecture & Integrity Card */}
        <div className="p-6 glass-card rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Inference Engine Details</span>
            </div>
            <h4 className="font-display font-bold text-lg text-white">
              {result.champion_regressor}
            </h4>
          </div>

          <div className="space-y-2 text-xs divide-y divide-white/5">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Artifact Version</span>
              <span className="font-mono text-cyan-300 font-semibold">{result.model_version}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Explainability Explainer</span>
              <span className="text-slate-200">SHAP Tree & LIME Tabular</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Input Features Transformed</span>
              <span className="text-emerald-400 font-bold">72 features</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Calibrated cross-validated inference</span>
          </div>
        </div>

      </div>

      {/* Row 2: 2-Column Panoramic Layout for SHAP Chart and Reasoning/LIME */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: SHAP Feature Importance Chart (7 Cols) */}
        <div className="xl:col-span-7 space-y-6">
          <FeatureImportanceChart features={result.top_features} />
        </div>

        {/* Right Column: AI Natural Language Reasoning + LIME Surrogates (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Natural Language Insights */}
          <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-4 bg-gradient-to-br from-brand-950/20 via-slate-900/60 to-transparent">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Natural Language Reasoning</span>
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Why was this score projected?
            </h3>
            <div className="space-y-2.5 pt-1">
              {result.human_readable_insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3 text-xs text-slate-300 leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LIME Surrogate Explanations */}
          {result.lime_explanations.length > 0 && (
            <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    Local Interpretable Surrogates (LIME)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Decision boundary weights near this student profile
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                  LIME Explainer
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.lime_explanations.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-white/5 text-xs space-y-1">
                    <div className="text-[11px] font-mono text-slate-400 truncate" title={item.rule}>
                      {item.rule}
                    </div>
                    <div className={`font-bold ${item.weight >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.weight >= 0 ? `+${item.weight.toFixed(3)}` : item.weight.toFixed(3)} weight
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Row 3: Actionable Growth Strategies Card */}
      <RecommendationsCard recommendations={result.recommendations} />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        result={result}
      />

    </div>
  );
};
