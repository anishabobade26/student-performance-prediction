import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { BatchResult } from '../types';
import { useNotification } from '../context/NotificationContext';

export const BatchPredictPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);
  const { success, error } = useNotification();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        error('Invalid File', 'Please upload a valid .csv file.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadAndPredict = async () => {
    if (!file) {
      error('No file selected', 'Please select a CSV file to process.');
      return;
    }
    setIsProcessing(true);
    try {
      const result = await api.predict.batchPredict(file);
      setBatchResult(result);
      success('Batch Processing Complete!', `Evaluated ${result.total_students} students in ${result.processing_time_seconds}s.`);
    } catch (err: any) {
      error('Batch Processing Failed', err.response?.data?.detail || 'Could not parse or process CSV file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold mb-2.5">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <span>High-Throughput Vectorized Inference</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            Batch Student Performance Inference
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Upload institutional student rosters in CSV format to execute multi-student predictions, risk classification, and growth recommendations in parallel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={api.predict.getTemplateUrl()}
            download="student_batch_template.csv"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold glass-card border border-white/10 hover:bg-white/5 text-slate-200 transition-all hover:border-cyan-500/30"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download CSV Template</span>
          </a>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="p-8 sm:p-12 rounded-3xl glass-card border border-white/10 text-center relative overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/90 shadow-2xl">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-14 transition-all flex flex-col items-center justify-center space-y-5 ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/10'
              : 'border-white/15 hover:border-cyan-500/40 bg-slate-900/40'
          }`}
        >
          <div className="w-18 h-18 p-4 rounded-3xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/15">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="font-display font-bold text-xl text-white">
              {file ? file.name : 'Drag & drop student roster CSV here'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Supports standard comma or semicolon delimited CSV files. Automatic column alignment and data sanitization for up to 10,000 rows.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <label className="cursor-pointer px-6 py-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-all border border-white/10 hover:border-white/20">
              <span>Browse Files</span>
              <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            </label>

            {file && (
              <button
                type="button"
                onClick={handleUploadAndPredict}
                disabled={isProcessing}
                className="px-8 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 text-white shadow-xl shadow-cyan-500/25 hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProcessing ? 'Processing Inferences...' : 'Execute Batch Forecast'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Batch Result Summary & Table */}
      {batchResult && (
        <div className="space-y-8">
          
          {/* Summary KPI Cards Grid (6 Cols) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
              <span className="text-xs font-semibold text-slate-400">Total Processed</span>
              <div className="text-2xl font-extrabold text-white">{batchResult.total_students}</div>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
              <span className="text-xs font-semibold text-slate-400">Passed Students</span>
              <div className="text-2xl font-extrabold text-emerald-400">{batchResult.passed_count}</div>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
              <span className="text-xs font-semibold text-slate-400">Failed Students</span>
              <div className="text-2xl font-extrabold text-rose-400">{batchResult.failed_count}</div>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
              <span className="text-xs font-semibold text-slate-400">Pass Rate</span>
              <div className="text-2xl font-extrabold text-cyan-400">{batchResult.pass_rate_percentage}%</div>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
              <span className="text-xs font-semibold text-slate-400">Average Grade</span>
              <div className="text-2xl font-extrabold text-brand-300">{batchResult.average_predicted_grade} / 20</div>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
              <span className="text-xs font-semibold text-slate-400">High Risk Count</span>
              <div className="text-2xl font-extrabold text-amber-400">{batchResult.high_risk_count}</div>
            </div>
          </div>

          {/* Table Card (Full Width) */}
          <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Batch Inference Output Table
                </h3>
                <p className="text-xs text-slate-400">
                  Showing predicted scores, risk assessments, and top prescribed growth actions
                </p>
              </div>

              <a
                href={api.predict.downloadBatch(batchResult.batch_id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Annotated CSV</span>
              </a>
            </div>

            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-900 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Row</th>
                    <th className="py-3.5 px-4">Predicted G3</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Pass Probability</th>
                    <th className="py-3.5 px-4">Risk Level</th>
                    <th className="py-3.5 px-4">Performance Tier</th>
                    <th className="py-3.5 px-4">Top Actionable Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {batchResult.predictions.map((item) => (
                    <tr key={item.row_index} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400">#{item.row_index}</td>
                      <td className="py-3.5 px-4 font-bold text-white text-sm">{item.predicted_g3.toFixed(1)} / 20</td>
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
                      <td className="py-3.5 px-4 text-slate-300 font-medium">{item.performance_tier}</td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-md truncate" title={item.top_recommendation}>
                        {item.top_recommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
