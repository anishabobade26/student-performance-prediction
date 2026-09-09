import React, { useState } from 'react';
import { Recommendation } from '../../types';
import { Sparkles, CheckCircle, Target, TrendingUp, ChevronRight } from 'lucide-react';

interface RecommendationsCardProps {
  recommendations: Recommendation[];
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string, stepIndex: number) => {
    const key = `${id}-${stepIndex}`;
    setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="p-6 glass-card rounded-2xl border border-white/10 space-y-5">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-base text-white">
              Personalized AI Growth Strategy
            </h3>
            <p className="text-xs text-slate-400">
              Prescriptive interventions tailored to bridge learning gaps and maximize G3 final grade
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md border ${getPriorityBadge(rec.priority)}`}>
                  {rec.priority} Priority
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {rec.category}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Est. Boost: {rec.expected_impact}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white">{rec.title}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rec.description}</p>
            </div>

            {/* Actionable Checkbox Items */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Action Steps:
              </span>
              {rec.action_steps.map((step, idx) => {
                const isDone = !!completedSteps[`${rec.id}-${idx}`];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleStep(rec.id, idx)}
                    className="w-full flex items-start gap-2.5 text-left p-2 rounded-lg hover:bg-white/5 transition-colors text-xs text-slate-300 group"
                  >
                    <div className="mt-0.5">
                      <CheckCircle
                        className={`w-4 h-4 transition-colors ${
                          isDone ? 'text-emerald-400 fill-emerald-500/20' : 'text-slate-600 group-hover:text-slate-400'
                        }`}
                      />
                    </div>
                    <span className={isDone ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {step}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Target Metric Badge */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-[11px] text-brand-300">
              <Target className="w-3.5 h-3.5 text-brand-400" />
              <span>Target KPI: {rec.target_metric}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
