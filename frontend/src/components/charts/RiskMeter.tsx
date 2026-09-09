import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskMeterProps {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  confidenceScore: number;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ riskLevel, confidenceScore }) => {
  const getRiskConfig = () => {
    switch (riskLevel) {
      case 'Low':
        return {
          percentage: 20,
          color: 'from-emerald-500 to-teal-400',
          textColor: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10 border-emerald-500/20',
          icon: ShieldCheck,
          label: 'Low Risk',
          description: 'High likelihood of academic success without critical bottlenecks.',
        };
      case 'Medium':
        return {
          percentage: 45,
          color: 'from-blue-500 to-sky-400',
          textColor: 'text-sky-400',
          bgColor: 'bg-sky-500/10 border-sky-500/20',
          icon: ShieldCheck,
          label: 'Moderate Risk',
          description: 'Stable performance with minor vulnerabilities in study hours or attendance.',
        };
      case 'High':
        return {
          percentage: 75,
          color: 'from-amber-500 to-orange-400',
          textColor: 'text-amber-400',
          bgColor: 'bg-amber-500/10 border-amber-500/20',
          icon: AlertTriangle,
          label: 'High Risk',
          description: 'Significant danger of grade decline or subject failure without intervention.',
        };
      case 'Critical':
      default:
        return {
          percentage: 95,
          color: 'from-rose-600 to-red-500',
          textColor: 'text-rose-400',
          bgColor: 'bg-rose-500/10 border-rose-500/20',
          icon: ShieldAlert,
          label: 'Critical Risk',
          description: 'Immediate remediation required. History of failures or extreme absenteeism.',
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  return (
    <div className="p-6 glass-card rounded-2xl border border-white/10 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${config.bgColor}`}>
            <Icon className={`w-5 h-5 ${config.textColor}`} />
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm text-white">Academic Risk Profile</h4>
            <span className={`text-xs font-bold uppercase tracking-wider ${config.textColor}`}>
              {config.label}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Model Confidence</span>
          <div className="font-bold text-sm text-white">{confidenceScore}%</div>
        </div>
      </div>

      {/* Segmented Gradient Bar */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${config.percentage}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${config.color} shadow-lg`}
          />
        </div>

        {/* Meter Labels */}
        <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1">
          <span>Low (0-25%)</span>
          <span>Medium (25-50%)</span>
          <span>High (50-75%)</span>
          <span>Critical (75-100%)</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        {config.description}
      </p>
    </div>
  );
};
