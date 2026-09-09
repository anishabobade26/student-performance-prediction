import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  Sparkles,
  GraduationCap,
  BookOpen,
  Home,
  Users,
  Activity,
  Award,
  ArrowRight,
  RefreshCw,
  Zap,
  Info,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { StudentData, PresetStudent } from '../types';
import { useNotification } from '../context/NotificationContext';

const defaultStudent: StudentData = {
  school: 'GP',
  sex: 'F',
  age: 17,
  address: 'U',
  famsize: 'GT3',
  Pstatus: 'T',
  Medu: 3,
  Fedu: 3,
  Mjob: 'services',
  Fjob: 'other',
  reason: 'course',
  guardian: 'mother',
  traveltime: 1,
  studytime: 2,
  failures: 0,
  schoolsup: 'no',
  famsup: 'yes',
  paid: 'no',
  activities: 'yes',
  nursery: 'yes',
  higher: 'yes',
  internet: 'yes',
  romantic: 'no',
  famrel: 4,
  freetime: 3,
  goout: 3,
  Dalc: 1,
  Walc: 1,
  health: 4,
  absences: 2,
  G1: 12.0,
  G2: 13.0,
};

export const PredictPage: React.FC = () => {
  const [formData, setFormData] = useState<StudentData>(defaultStudent);
  const [presets, setPresets] = useState<PresetStudent[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const data = await api.predict.getPresets();
        setPresets(data);
      } catch (err) {
        console.warn('Could not load presets:', err);
      }
    };
    fetchPresets();
  }, []);

  const handleChange = (field: keyof StudentData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof prev[field] === 'number' ? Number(value) : value,
    }));
  };

  const applyPreset = (preset: PresetStudent) => {
    setFormData(preset.data);
    success(`Applied preset: ${preset.name}`, preset.description);
  };

  // Real-time dynamic estimation preview for sticky sidebar
  const estimatedTelemetry = useMemo(() => {
    // Weighted heuristic estimation for instant feedback
    const baseG = formData.G2 * 0.55 + formData.G1 * 0.35;
    const studyBonus = (formData.studytime - 2) * 0.4;
    const failurePenalty = formData.failures * 1.2;
    const absencePenalty = Math.min(formData.absences * 0.08, 1.5);
    const higherBonus = formData.higher === 'yes' ? 0.4 : -0.4;
    const estimatedScore = Math.max(0, Math.min(20, baseG + studyBonus - failurePenalty - absencePenalty + higherBonus));
    const passProb = 1 / (1 + Math.exp(-(estimatedScore - 9.8) * 0.9));
    const risk = estimatedScore >= 14 ? 'Low' : estimatedScore >= 10 ? 'Medium' : estimatedScore >= 7 ? 'High' : 'Critical';
    
    return {
      score: estimatedScore.toFixed(1),
      passProb: (passProb * 100).toFixed(0),
      isPass: estimatedScore >= 10,
      risk,
    };
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await api.predict.predictSingle(formData);
      success('Prediction Generated!', `Predicted Score: ${result.predicted_g3}/20 (${result.pass_fail})`);
      sessionStorage.setItem('student_ai_last_result', JSON.stringify(result));
      navigate('/result', { state: { result } });
    } catch (err: any) {
      error('Prediction Failed', err.response?.data?.message || 'Could not process prediction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold mb-2.5">
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            <span>AI Student Diagnostic Evaluation Terminal</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            Student Performance Prediction & Explainability
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Configure 30 academic, demographic, and behavioral features to compute calibrated grade projections ($G3 \in [0, 20]$), risk classification, SHAP attributions, and LIME surrogate rules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFormData(defaultStudent)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold glass-card border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* 1-Click Quick Preset Selector Banner */}
      <div className="p-6 rounded-2xl glass-card border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-brand-950/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Instant Preset Student Profiles</span>
          </div>
          <span className="text-[11px] text-slate-400">Click any card to auto-populate all 30 parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="p-4 rounded-xl bg-slate-900/90 hover:bg-brand-600/20 border border-white/10 hover:border-cyan-500/40 text-left transition-all group hover:scale-[1.01] hover:shadow-lg shadow-black/40"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {preset.tag}
                </span>
                <Zap className="w-3.5 h-3.5 text-cyan-400 opacity-70 group-hover:opacity-100" />
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Split Form & Live Telemetry Sidebar */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Sections (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Historical Exam Grades */}
          <div className="p-6 sm:p-7 rounded-2xl glass-card border border-white/10 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    Historical Period Grades (Primary Predictors)
                  </h3>
                  <p className="text-xs text-slate-400">Exam scores in Period 1 (G1) and Period 2 (G2) on standard Portuguese 0–20 scale</p>
                </div>
              </div>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/25">
                Highest Importance
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-white">Period 1 Exam (G1)</label>
                  <span className={`font-mono font-extrabold text-base px-2.5 py-0.5 rounded-lg border ${
                    formData.G1 >= 10 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  }`}>
                    {formData.G1.toFixed(1)} / 20
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={formData.G1}
                  onChange={(e) => handleChange('G1', e.target.value)}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>0 (Fail)</span>
                  <span className="text-slate-400">10 (Pass Threshold)</span>
                  <span className="text-emerald-400">20 (Max)</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-white">Period 2 Exam (G2)</label>
                  <span className={`font-mono font-extrabold text-base px-2.5 py-0.5 rounded-lg border ${
                    formData.G2 >= 10 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  }`}>
                    {formData.G2.toFixed(1)} / 20
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={formData.G2}
                  onChange={(e) => handleChange('G2', e.target.value)}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>0 (Fail)</span>
                  <span className="text-slate-400">10 (Pass Threshold)</span>
                  <span className="text-brand-400">20 (Max)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Study Habits, Attendance & Past Failures */}
          <div className="p-6 sm:p-7 rounded-2xl glass-card border border-white/10 space-y-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Study Habits, Failures & Attendance</h3>
                <p className="text-xs text-slate-400">Weekly allocation, past subject failures, and school absences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Weekly Study Time</label>
                <select
                  value={formData.studytime}
                  onChange={(e) => handleChange('studytime', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value={1}>1 - Less than 2 hours / week</option>
                  <option value={2}>2 - 2 to 5 hours / week</option>
                  <option value={3}>3 - 5 to 10 hours / week</option>
                  <option value={4}>4 - More than 10 hours / week</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Past Class Failures</label>
                <select
                  value={formData.failures}
                  onChange={(e) => handleChange('failures', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value={0}>0 failures (Clean record)</option>
                  <option value={1}>1 past failure</option>
                  <option value={2}>2 past failures</option>
                  <option value={3}>3 past failures</option>
                  <option value={4}>4+ past failures</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Total School Absences (Days)</label>
                <input
                  type="number"
                  min="0"
                  max="93"
                  value={formData.absences}
                  onChange={(e) => handleChange('absences', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Educational Support & Extracurriculars */}
          <div className="p-6 sm:p-7 rounded-2xl glass-card border border-white/10 space-y-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Educational Support & Environment</h3>
                <p className="text-xs text-slate-400">Tutoring, family support, higher education intent, and internet access</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Extra School Support', field: 'schoolsup' as const },
                { label: 'Family Academic Support', field: 'famsup' as const },
                { label: 'Paid Extra Classes', field: 'paid' as const },
                { label: 'Extracurricular Activities', field: 'activities' as const },
                { label: 'Attended Nursery', field: 'nursery' as const },
                { label: 'Higher Education Goal', field: 'higher' as const },
                { label: 'Home Internet Access', field: 'internet' as const },
                { label: 'Romantic Relationship', field: 'romantic' as const },
              ].map((item) => (
                <div key={item.field} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 truncate" title={item.label}>
                    {item.label}
                  </label>
                  <select
                    value={formData[item.field]}
                    onChange={(e) => handleChange(item.field, e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Demographics & Family Background */}
          <div className="p-6 sm:p-7 rounded-2xl glass-card border border-white/10 space-y-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Demographics & Parental Education</h3>
                <p className="text-xs text-slate-400">School, age, address type, parental jobs, and education tiers</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">School</label>
                <select
                  value={formData.school}
                  onChange={(e) => handleChange('school', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="GP">GP - Gabriel Pereira</option>
                  <option value="MS">MS - Mousinho da Silveira</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Sex</label>
                <select
                  value={formData.sex}
                  onChange={(e) => handleChange('sex', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Age</label>
                <input
                  type="number"
                  min="15"
                  max="22"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Address Type</label>
                <select
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="U">Urban (City)</option>
                  <option value="R">Rural</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Mother's Education</label>
                <select
                  value={formData.Medu}
                  onChange={(e) => handleChange('Medu', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value={0}>0 - None</option>
                  <option value={1}>1 - Primary (4th grade)</option>
                  <option value={2}>2 - 5th to 9th grade</option>
                  <option value={3}>3 - Secondary Education</option>
                  <option value={4}>4 - Higher Education</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Father's Education</label>
                <select
                  value={formData.Fedu}
                  onChange={(e) => handleChange('Fedu', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value={0}>0 - None</option>
                  <option value={1}>1 - Primary (4th grade)</option>
                  <option value={2}>2 - 5th to 9th grade</option>
                  <option value={3}>3 - Secondary Education</option>
                  <option value={4}>4 - Higher Education</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Mother's Occupation</label>
                <select
                  value={formData.Mjob}
                  onChange={(e) => handleChange('Mjob', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="teacher">Teacher</option>
                  <option value="health">Healthcare</option>
                  <option value="services">Civil Services</option>
                  <option value="at_home">At Home</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Father's Occupation</label>
                <select
                  value={formData.Fjob}
                  onChange={(e) => handleChange('Fjob', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="teacher">Teacher</option>
                  <option value="health">Healthcare</option>
                  <option value="services">Civil Services</option>
                  <option value="at_home">At Home</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Social, Wellness & Lifestyle */}
          <div className="p-6 sm:p-7 rounded-2xl glass-card border border-white/10 space-y-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Social, Wellness & Alcohol Index</h3>
                <p className="text-xs text-slate-400">Family relationships, free time, going out, and alcohol consumption indices</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Family Relations</label>
                <select
                  value={formData.famrel}
                  onChange={(e) => handleChange('famrel', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value={1}>1 - Very Bad</option>
                  <option value={2}>2 - Bad</option>
                  <option value={3}>3 - Neutral</option>
                  <option value={4}>4 - Good</option>
                  <option value={5}>5 - Excellent</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Free Time</label>
                <select
                  value={formData.freetime}
                  onChange={(e) => handleChange('freetime', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value={1}>1 - Very Low</option>
                  <option value={2}>2 - Low</option>
                  <option value={3}>3 - Normal</option>
                  <option value={4}>4 - High</option>
                  <option value={5}>5 - Very High</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Going Out</label>
                <select
                  value={formData.goout}
                  onChange={(e) => handleChange('goout', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value={1}>1 - Very Low</option>
                  <option value={2}>2 - Low</option>
                  <option value={3}>3 - Normal</option>
                  <option value={4}>4 - High</option>
                  <option value={5}>5 - Very High</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Alcohol Index</label>
                <select
                  value={formData.Dalc}
                  onChange={(e) => handleChange('Dalc', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value={1}>1 - Very Low</option>
                  <option value={2}>2 - Low</option>
                  <option value={3}>3 - Medium</option>
                  <option value={4}>4 - High</option>
                  <option value={5}>5 - Very High</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Current Health</label>
                <select
                  value={formData.health}
                  onChange={(e) => handleChange('health', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value={1}>1 - Very Bad</option>
                  <option value={2}>2 - Bad</option>
                  <option value={3}>3 - Neutral</option>
                  <option value={4}>4 - Good</option>
                  <option value={5}>5 - Very Good</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Live Telemetry & Quick Action Terminal (4 Cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          
          {/* Live Heuristic Preview Card */}
          <div className="p-6 sm:p-7 rounded-3xl glass-card border border-cyan-500/30 space-y-6 relative overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/90 shadow-2xl">
            {/* Ambient Aura */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-cyan-400 animate-pulse" />
                <h3 className="font-display font-bold text-base text-white">Live Telemetry Preview</h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                REAL-TIME
              </span>
            </div>

            {/* Estimated Score Gauge Metric */}
            <div className="text-center py-2 space-y-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Estimated Final Grade (G3)
              </span>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className={`font-display font-extrabold text-5xl tracking-tight ${
                  estimatedTelemetry.isPass ? 'text-cyan-400' : 'text-rose-400'
                }`}>
                  {estimatedTelemetry.score}
                </span>
                <span className="text-slate-400 text-sm font-semibold">/ 20</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase ${
                  estimatedTelemetry.isPass
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {estimatedTelemetry.isPass ? 'Pass Track' : 'At-Risk Track'}
                </span>
                <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-white/5 text-slate-300 border border-white/10">
                  {estimatedTelemetry.risk} Risk
                </span>
              </div>
            </div>

            {/* Progress Probability Bar */}
            <div className="space-y-1.5 bg-slate-900/80 p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Pass Probability Forecast</span>
                <span className="text-cyan-300">{estimatedTelemetry.passProb}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${estimatedTelemetry.passProb}%` }}
                />
              </div>
            </div>

            {/* Feature Summary Checklist */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Academic Trajectory</span>
                <span className="font-semibold text-white">G1: {formData.G1} • G2: {formData.G2}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Study Habit Index</span>
                <span className="font-semibold text-white">{formData.studytime} ({formData.studytime * 2.5} hrs/wk)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Unexcused Absences</span>
                <span className={`font-semibold ${formData.absences > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {formData.absences} days
                </span>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-brand-600 via-cyan-500 to-emerald-500 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <BrainCircuit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>{isSubmitting ? 'Computing SHAP Attributions...' : 'Generate Full AI Diagnostic & XAI'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Model Trust & Pipeline Badge */}
          <div className="p-4 rounded-2xl glass-card border border-white/5 flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>9-Model Ensembles with calibrated probabilities and SHAP/LIME explainability.</span>
          </div>

        </div>

      </form>

    </div>
  );
};
