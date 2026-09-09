import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts';
import { FeatureImpact } from '../../types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface FeatureImportanceChartProps {
  features: FeatureImpact[];
}

export const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ features }) => {
  const chartData = features.slice(0, 8).map(f => ({
    name: f.feature,
    impact: f.impact,
    absImpact: f.magnitude,
    direction: f.direction
  }));

  return (
    <div className="p-6 glass-card rounded-2xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-base text-white">
            Explainable AI (SHAP Feature Contributions)
          </h3>
          <p className="text-xs text-slate-400">
            How individual student attributes shifted the predicted grade from the baseline mean (10.4)
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Positive Impact
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Negative Penalty
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <XAxis
              type="number"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#e2e8f0', fontSize: 11 }}
              width={140}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 bg-slate-900/95 border border-white/10 rounded-xl shadow-xl backdrop-blur-md text-xs">
                      <p className="font-semibold text-white">{data.name}</p>
                      <p className={`mt-1 font-bold ${data.impact >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {data.impact >= 0 ? `+${data.impact.toFixed(2)} pts (Boost)` : `${data.impact.toFixed(2)} pts (Penalty)`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x={0} stroke="#475569" strokeDasharray="3 3" />
            <Bar dataKey="impact" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.impact >= 0 ? '#10b981' : '#ef4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Positive / Negative Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
            <ArrowUpRight className="w-4 h-4" /> Top Strengths
          </div>
          <ul className="text-xs text-slate-300 space-y-1">
            {features.filter(f => f.direction === 'positive').slice(0, 2).map((f, i) => (
              <li key={i} className="truncate">
                • {f.feature} <span className="text-emerald-400 font-semibold">(+{f.impact.toFixed(1)} pts)</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-1">
            <ArrowDownRight className="w-4 h-4" /> Primary Vulnerabilities
          </div>
          <ul className="text-xs text-slate-300 space-y-1">
            {features.filter(f => f.direction === 'negative').slice(0, 2).map((f, i) => (
              <li key={i} className="truncate">
                • {f.feature} <span className="text-rose-400 font-semibold">({f.impact.toFixed(1)} pts)</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
