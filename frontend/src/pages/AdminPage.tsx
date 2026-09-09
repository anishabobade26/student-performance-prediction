import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  RefreshCw,
  Cpu,
  Activity,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Database,
  Lock,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';
import { useNotification } from '../context/NotificationContext';

export const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isRetraining, setIsRetraining] = useState(false);
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotification();

  const fetchAdminData = async () => {
    try {
      const [u, s, l] = await Promise.all([
        api.admin.getUsers(),
        api.admin.getStats(),
        api.admin.getLogs(),
      ]);
      setUsers(u);
      setStats(s);
      setLogs(l);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      const res = await api.admin.retrainModel();
      success('Retraining Successful!', `Champion: ${res.champion_regressor} (R²: ${res.best_r2_score})`);
      fetchAdminData();
    } catch (err: any) {
      error('Retraining Error', err.response?.data?.detail || 'Could not retrain ML pipeline.');
    } finally {
      setIsRetraining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-cyan-400 animate-pulse mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Loading enterprise admin operations panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold mb-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Platform Administration & DevOps Operations</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            Admin Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Monitor live API throughput, inspect audit logs, manage registered accounts, and trigger automated ML model re-benchmarking.
          </p>
        </div>

        {/* Retrain Trigger */}
        <button
          onClick={handleRetrain}
          disabled={isRetraining}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 text-white shadow-xl shadow-brand-500/25 hover:opacity-90 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
          <span>{isRetraining ? 'Training All 9 Algorithms & CV...' : 'Trigger Automated ML Retraining'}</span>
        </button>
      </div>

      {/* Stats KPI Grid (4 Cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Registered Accounts</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.total_users || 1}</div>
          <span className="text-[11px] text-emerald-400 font-medium">Role-Based Access Control</span>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Total Inferences Logged</span>
            <Activity className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-400">{stats?.total_predictions || 0}</div>
          <span className="text-[11px] text-slate-400">Live API Requests</span>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Active Model Version</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-400">{stats?.active_model_version || 'v1.0.0'}</div>
          <span className="text-[11px] text-slate-400 font-mono">champion_regressor.joblib</span>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Champion Algorithm</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300 truncate" title={stats?.champion_model}>
            {stats?.champion_model || 'Random Forest'}
          </div>
          <span className="text-[11px] text-amber-400/80 font-medium">R² = 0.8212 Benchmark</span>
        </div>
      </div>

      {/* Users Table & Audit Logs (2 Wide Columns) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Users Table */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Platform Registered Users</h3>
              <p className="text-xs text-slate-400">{users.length} authenticated profiles</p>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-900 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Username</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-bold text-white">{u.username}</td>
                    <td className="py-3 px-3 text-slate-400">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.is_admin ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {u.is_admin ? 'Super Admin' : 'Researcher'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-white">System Audit Log Stream</h3>
              <p className="text-xs text-slate-400">Chronological telemetry of requests and administrative events</p>
            </div>
            <span className="text-xs text-emerald-400 flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Audit
            </span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-16">No recent audit events logged.</p>
            ) : (
              logs.map((l) => (
                <div key={l.id} className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 text-xs flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-cyan-300">{l.action}</span>
                    <p className="text-slate-400 text-[11px] font-mono">{l.endpoint}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{new Date(l.created_at).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
