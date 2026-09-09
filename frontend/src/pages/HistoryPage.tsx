import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  Eye,
  Search,
  Filter,
  ArrowRight,
  Clock,
  X,
  FileText,
  ShieldCheck,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import { PredictionHistoryItem } from '../types';
import { useNotification } from '../context/NotificationContext';

export const HistoryPage: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionHistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotification();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.history.getAll(page, pageSize);
      setPredictions(data.predictions || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete prediction #${id}?`)) return;
    try {
      await api.history.deleteById(id);
      success('Record Deleted', `Prediction #${id} has been removed from the database.`);
      fetchHistory();
    } catch (err) {
      error('Delete Failed', 'Could not remove prediction record.');
    }
  };

  const filtered = predictions.filter(p =>
    p.id.toString().includes(searchQuery) ||
    p.pass_fail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.risk_level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold mb-2.5">
            <History className="w-4 h-4 text-cyan-400" />
            <span>Institutional Audit Records</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            Prediction History & Inference Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Browse, search, inspect, and manage historical student evaluations, feature profiles, and generated prescriptive recommendations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Status, or Risk Tier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-lg shadow-black/20"
          />
        </div>
      </div>

      {/* Table Card (Full Width) */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-4">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 space-y-3">
            <History className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <p>Loading prediction database records...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-500 space-y-2">
            <History className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-400">No matching history records found.</p>
            <p>Run a prediction to log an evaluation record into the audit system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Record ID</th>
                  <th className="py-3.5 px-4">Predicted Final Grade</th>
                  <th className="py-3.5 px-4">Pass / Fail Status</th>
                  <th className="py-3.5 px-4">Pass Probability</th>
                  <th className="py-3.5 px-4">Risk Tier</th>
                  <th className="py-3.5 px-4">Performance Tier</th>
                  <th className="py-3.5 px-4">Evaluated Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">#{item.id}</td>
                    <td className="py-3.5 px-4 font-bold text-white text-sm">
                      {item.predicted_g3.toFixed(1)} / 20
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.pass_fail === 'Pass' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {item.pass_fail}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-cyan-300 font-semibold">{(item.pass_probability * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-semibold ${
                        item.risk_level === 'Low' ? 'text-emerald-400' : item.risk_level === 'Medium' ? 'text-cyan-400' : 'text-rose-400'
                      }`}>
                        {item.risk_level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{item.performance_tier}</td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedPrediction(item)}
                          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
                          title="View Feature Snapshot"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/15 transition-all"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > pageSize && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-slate-400">
            <div>
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} records
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl glass-card hover:bg-white/5 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page * pageSize >= total}
                className="px-4 py-2 rounded-xl glass-card hover:bg-white/5 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedPrediction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-7 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Prediction Snapshot #{selectedPrediction.id}
                </h3>
                <p className="text-xs text-slate-400">Evaluated on {new Date(selectedPrediction.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedPrediction(null)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/5">
                <span className="text-slate-400">Predicted Final Grade</span>
                <div className="text-2xl font-extrabold text-cyan-400 mt-1">{selectedPrediction.predicted_g3} / 20</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/5">
                <span className="text-slate-400">Outcome & Risk Stratification</span>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">{selectedPrediction.pass_fail} ({selectedPrediction.risk_level})</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white">Student Input Features:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 bg-slate-950 rounded-2xl font-mono text-[11px] text-slate-300 border border-white/5">
                {Object.entries(selectedPrediction.student_data).map(([k, v]) => (
                  <div key={k} className="truncate">
                    <span className="text-slate-500">{k}:</span> <span className="text-white font-semibold">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
