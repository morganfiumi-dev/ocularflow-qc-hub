/**
 * ScoreTab - Displays asset score, clip breakdown, and category analysis
 * UI-only component
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface Issue {
  id: number;
  categoryId: string;
  severity: 'error' | 'warning' | 'info';
}

interface ScoreTabProps {
  assetScore: number;
  clipScores: number[];
  issues: Issue[];
}

export function ScoreTab({ assetScore, clipScores, issues }: ScoreTabProps) {
  
  // Calculate category breakdown
  const categoryBreakdown = issues.reduce((acc, issue) => {
    if (!acc[issue.categoryId]) {
      acc[issue.categoryId] = { error: 0, warning: 0, info: 0, total: 0 };
    }
    acc[issue.categoryId][issue.severity]++;
    acc[issue.categoryId].total++;
    return acc;
  }, {} as Record<string, { error: number; warning: number; info: number; total: number }>);

  const categoryNames: Record<string, string> = {
    timing_sync: 'Timing & Sync',
    dialogue_integrity: 'Dialogue Integrity',
    channel_integrity: 'Channel Integrity',
    synthetic_voice: 'Synthetic Voice',
    translation: 'Translation',
    audio_deficiency: 'Audio Deficiency',
  };

  const passCount = clipScores.filter(s => s >= 90).length;
  const reviewCount = clipScores.filter(s => s >= 70 && s < 90).length;
  const failCount = clipScores.filter(s => s < 70).length;

  return (
    <div className="p-4 space-y-6">
      {/* Overall Score */}
      <div className="space-y-3">
        <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Overall Score</h3>
        
        <div className="bg-slate-950/60 rounded-lg border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-bold font-mono text-cyan-400">
                {assetScore.toFixed(1)}
              </div>
              <div className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">Asset Score</div>
            </div>
            
            <div className={`
              px-4 py-2 rounded-lg font-bold text-sm
              ${assetScore >= 90 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : assetScore >= 70
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }
            `}>
              {assetScore >= 90 ? 'PASS' : assetScore >= 70 ? 'REVIEW' : 'FAIL'}
            </div>
          </div>

          {/* Radial gauge (UI mock) */}
          <div className="relative h-32 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 200 120">
              {/* Background arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="rgb(30, 41, 59)"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Score arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke={assetScore >= 90 ? 'rgb(74, 222, 128)' : assetScore >= 70 ? 'rgb(251, 191, 36)' : 'rgb(248, 113, 113)'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(assetScore / 100) * 251}, 251`}
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-600 mt-4">
            <span>Target: 100</span>
            <span>Threshold: 70</span>
          </div>
        </div>
      </div>

      {/* Clip Breakdown */}
      <div className="space-y-3">
        <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Clip Breakdown</h3>
        
        <div className="bg-slate-950/60 rounded border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded border border-green-500/30">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-300">Pass (≥90)</span>
            </div>
            <span className="text-sm font-bold text-green-400">{passCount}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded border border-amber-500/30">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300">Review (70-89)</span>
            </div>
            <span className="text-sm font-bold text-amber-400">{reviewCount}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-500/10 rounded border border-red-500/30">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-slate-300">Fail (&lt;70)</span>
            </div>
            <span className="text-sm font-bold text-red-400">{failCount}</span>
          </div>
        </div>
      </div>

      {/* Category Analysis */}
      <div className="space-y-3">
        <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Category Analysis</h3>
        
        <div className="bg-slate-950/60 rounded border border-slate-800 p-4 space-y-3">
          {Object.entries(categoryBreakdown).map(([categoryId, counts]) => (
            <div key={categoryId} className="border-b border-slate-800 last:border-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-300 font-semibold">
                  {categoryNames[categoryId] || categoryId}
                </span>
                <span className="text-xs text-slate-500">{counts.total} issues</span>
              </div>

              <div className="flex gap-2">
                {counts.error > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-500/10 rounded border border-red-500/30">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <span className="text-[10px] text-red-400 font-semibold">{counts.error}</span>
                  </div>
                )}
                {counts.warning > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 rounded border border-amber-500/30">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] text-amber-400 font-semibold">{counts.warning}</span>
                  </div>
                )}
                {counts.info > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 rounded border border-blue-500/30">
                    <Minus className="w-3 h-3 text-blue-400" />
                    <span className="text-[10px] text-blue-400 font-semibold">{counts.info}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {Object.keys(categoryBreakdown).length === 0 && (
            <div className="text-center py-6 text-slate-500 text-xs">
              No issues detected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}