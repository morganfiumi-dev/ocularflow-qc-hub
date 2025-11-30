/**
 * Bipolar Divergence Graph
 * UI-only visualization for prosody differences
 */

import React from 'react';

export function BipolarDivergenceGraph() {
  // Placeholder data
  const dataPoints = Array.from({ length: 50 }, (_, i) => ({
    x: i,
    source: Math.sin(i * 0.2) * 30 + Math.random() * 10,
    dub: Math.sin(i * 0.2 + 0.5) * 30 + Math.random() * 10
  }));

  return (
    <div className="p-4 bg-slate-900/40 rounded-lg border border-slate-800">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
        Prosody Divergence
      </h4>

      <div className="relative h-32 bg-slate-950/50 rounded border border-slate-800">
        <svg className="w-full h-full" viewBox="0 0 500 128">
          {/* Center line */}
          <line x1="0" y1="64" x2="500" y2="64" stroke="rgb(71 85 105)" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Source line (top half) */}
          <polyline
            points={dataPoints.map((d, i) => `${i * 10},${64 - d.source}`).join(' ')}
            fill="none"
            stroke="rgb(56 189 248)"
            strokeWidth="2"
          />
          
          {/* Dub line (bottom half) */}
          <polyline
            points={dataPoints.map((d, i) => `${i * 10},${64 + d.dub}`).join(' ')}
            fill="none"
            stroke="rgb(251 146 60)"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="flex items-center justify-between mt-2 text-[9px]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-cyan-400" />
            <span className="text-slate-500">Source</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-orange-400" />
            <span className="text-slate-500">Dub</span>
          </div>
        </div>
        <span className="text-slate-600">Variance: 23%</span>
      </div>
    </div>
  );
}
