/**
 * Artifact Heatmap
 * UI-only visualization for synthetic artifacts
 */

import React from 'react';

export function ArtifactHeatmap() {
  const blocks = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    intensity: Math.random()
  }));

  return (
    <div className="p-4 bg-slate-900/40 rounded-lg border border-slate-800">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
        Artifact Hotspot Detection
      </h4>

      <div className="grid grid-cols-12 gap-1 mb-3">
        {blocks.map((block) => {
          const color = block.intensity > 0.7 ? 'bg-red-500' :
                       block.intensity > 0.4 ? 'bg-orange-500' :
                       block.intensity > 0.2 ? 'bg-amber-500' :
                       'bg-slate-800';
          
          return (
            <div
              key={block.id}
              className={`h-4 rounded ${color} ${block.intensity > 0.7 ? 'animate-pulse' : ''}`}
              style={{ opacity: Math.max(0.3, block.intensity) }}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-slate-500">Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span className="text-slate-500">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-slate-500">Medium</span>
          </div>
        </div>
        <span className="text-slate-600">3 hotspots detected</span>
      </div>
    </div>
  );
}
