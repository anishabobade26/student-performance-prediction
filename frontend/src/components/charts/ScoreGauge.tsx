import React from 'react';
import { motion } from 'framer-motion';

interface ScoreGaugeProps {
  score: number; // 0 - 20 scale
  percentage: number; // 0 - 100%
  tier: string;
  passFail: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, percentage, tier, passFail }) => {
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (score >= 16) return { stroke: '#10b981', text: 'text-emerald-400', glow: 'rgba(16, 185, 129, 0.4)' };
    if (score >= 14) return { stroke: '#3b82f6', text: 'text-brand-400', glow: 'rgba(59, 130, 246, 0.4)' };
    if (score >= 10) return { stroke: '#f59e0b', text: 'text-amber-400', glow: 'rgba(245, 158, 11, 0.4)' };
    return { stroke: '#ef4444', text: 'text-rose-400', glow: 'rgba(239, 68, 68, 0.4)' };
  };

  const themeColors = getColor();

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card rounded-2xl border border-white/10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute w-40 h-40 rounded-full blur-3xl opacity-20 -z-0 pointer-events-none"
        style={{ backgroundColor: themeColors.stroke }}
      />

      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            stroke="rgba(255, 255, 255, 0.08)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Animated progress circle */}
          <motion.circle
            stroke={themeColors.stroke}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`font-display font-extrabold text-3xl tracking-tight ${themeColors.text}`}
          >
            {score.toFixed(1)}
          </motion.span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            out of 20
          </span>
        </div>
      </div>

      {/* Subtitle Badges */}
      <div className="mt-4 flex flex-col items-center gap-1.5 z-10">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              passFail === 'Pass'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {passFail}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-300 border border-white/10">
            {tier}
          </span>
        </div>
        <p className="text-xs text-slate-400">{percentage}% Scaled Equivalent</p>
      </div>
    </div>
  );
};
