/**
 * Sync Drift Bar
 * UI-only visualization for timing sync issues
 */

import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function SyncDriftBar() {
  // Placeholder: -50ms drift (early)
  const driftMs = -50;
  const toleranceMs = 100;
  const position = 50 + (driftMs / toleranceMs) * 40; // Center at 50%

  return (
    <div className="p-4 bg-slate-900/40 rounded-lg border border-slate-800">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Sync Drift Analysis
        </h4>
        <p className="text-[9px] text-slate-500 max-w-[55%] text-right leading-relaxed">
          Timeline shows if dialogue starts early/late relative to tolerance thresholds
        </p>
      </div>

      <div className="relative">
        <div className="h-8 bg-slate-950/50 rounded border border-slate-800 relative overflow-hidden">
          {/* Tolerance zones */}
          <div className="absolute inset-y-0 left-0 w-[30%] bg-red-500/10 border-r border-red-500/30" />
          <div className="absolute inset-y-0 right-0 w-[30%] bg-red-500/10 border-l border-red-500/30" />
          <div className="absolute inset-y-0 left-[30%] right-[30%] bg-green-500/10" />
          
          {/* Center marker */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-600" />
          
          {/* Drift indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-6 bg-cyan-400 rounded shadow-lg"
            style={{ left: `${position}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-[9px] text-slate-500">
          <div className="flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Early</span>
          </div>
          <span className="font-mono text-slate-400">{Math.abs(driftMs)}ms</span>
          <div className="flex items-center gap-1">
            <span>Late</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded">
        <p className="text-[10px] text-amber-400">
          Entry is 50ms early. Consider adjusting cut-in point.
        </p>
      </div>
    </div>
  );
}
