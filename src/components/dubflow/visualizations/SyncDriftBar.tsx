/**
 * Sync Drift Bar - Simplified & Clear
 * Shows if dub dialogue starts too early or too late vs original
 */

import React from 'react';
import { ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

export function SyncDriftBar() {
  // Placeholder: -50ms drift (early)
  const driftMs = -50;
  const toleranceMs = 100;
  const position = 50 + (driftMs / toleranceMs) * 40; // Center at 50%

  const isEarly = driftMs < 0;
  const isLate = driftMs > 0;
  const isPerfect = Math.abs(driftMs) <= 20;

  return (
    <div className="space-y-3">
      {/* What am I looking at? */}
      <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
        <div className="flex items-start gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[11px] font-bold text-slate-200 mb-1">
              What This Shows
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              This bar shows if the dubbed audio starts <span className="font-semibold text-amber-400">too early</span> or{' '}
              <span className="font-semibold text-red-400">too late</span> compared to the original. 
              The cyan marker shows current timing.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Bar */}
      <div className="relative">
        {/* Legend above bar */}
        <div className="flex items-center justify-between mb-2 text-[9px] text-slate-500">
          <div className="flex items-center gap-1">
            <ArrowLeft className="w-3 h-3 text-amber-400" />
            <span className="text-amber-400 font-semibold">TOO EARLY</span>
          </div>
          <span className="text-green-400 font-semibold">PERFECT SYNC</span>
          <div className="flex items-center gap-1">
            <span className="text-red-400 font-semibold">TOO LATE</span>
            <ArrowRight className="w-3 h-3 text-red-400" />
          </div>
        </div>

        {/* The Bar */}
        <div className="h-10 bg-slate-950/50 rounded-lg border border-slate-800 relative overflow-hidden">
          {/* Color zones */}
          <div className="absolute inset-y-0 left-0 w-[30%] bg-amber-500/20 border-r border-amber-500/40">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] text-amber-400 font-bold uppercase tracking-wider">Early</span>
            </div>
          </div>
          <div className="absolute inset-y-0 left-[30%] right-[30%] bg-green-500/20 border-x border-green-500/40">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] text-green-400 font-bold uppercase tracking-wider">OK</span>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 w-[30%] bg-red-500/20 border-l border-red-500/40">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] text-red-400 font-bold uppercase tracking-wider">Late</span>
            </div>
          </div>
          
          {/* Center marker (perfect sync) */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-400">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-400 rounded-full" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-400 rounded-full" />
          </div>
          
          {/* Current drift indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ left: `${position}%` }}
          >
            <div className="relative">
              <div className="w-3 h-8 bg-cyan-400 rounded shadow-lg border-2 border-cyan-300 animate-pulse" />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <div className="px-2 py-0.5 bg-cyan-500 text-white text-[9px] font-bold rounded shadow-lg">
                  {Math.abs(driftMs)}ms
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scale marks */}
        <div className="flex items-center justify-between mt-1 px-1">
          <span className="text-[8px] text-slate-600 font-mono">-100ms</span>
          <span className="text-[8px] text-slate-600 font-mono">0ms</span>
          <span className="text-[8px] text-slate-600 font-mono">+100ms</span>
        </div>
      </div>

      {/* Explanation of current state */}
      <div className={`p-3 rounded-lg border ${
        isPerfect 
          ? 'bg-green-500/10 border-green-500/30' 
          : isEarly 
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-red-500/10 border-red-500/30'
      }`}>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <p className={`text-[11px] font-semibold mb-1 ${
              isPerfect ? 'text-green-400' : isEarly ? 'text-amber-400' : 'text-red-400'
            }`}>
              {isPerfect 
                ? '✓ Sync is Good' 
                : isEarly 
                ? '⚠ Dialogue Starts Too Early'
                : '⚠ Dialogue Starts Too Late'
              }
            </p>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {isPerfect 
                ? 'Timing is within acceptable range. No action needed.'
                : isEarly
                ? `The dubbed audio begins ${Math.abs(driftMs)}ms before the original speaker starts talking. This can look unnatural. Try shifting the dub start time forward.`
                : `The dubbed audio begins ${Math.abs(driftMs)}ms after the original speaker starts. This creates a delay. Try shifting the dub start time backward.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Quick reference guide */}
      <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
        <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Quick Reference
        </h5>
        <div className="space-y-1.5 text-[10px] text-slate-400">
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 rounded bg-green-500/30 border border-green-500/50 flex-shrink-0 mt-0.5" />
            <span><span className="font-semibold text-green-400">Green zone:</span> Within ±30ms - acceptable sync</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/50 flex-shrink-0 mt-0.5" />
            <span><span className="font-semibold text-amber-400">Yellow zone:</span> Early by 30-100ms - may need adjustment</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500/50 flex-shrink-0 mt-0.5" />
            <span><span className="font-semibold text-red-400">Red zone:</span> Late by 30-100ms - visible delay</span>
          </div>
        </div>
      </div>
    </div>
  );
}