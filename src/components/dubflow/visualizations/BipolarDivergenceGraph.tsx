/**
 * Bipolar Divergence Graph
 * Shows prosody differences at specific event time
 */

import React from 'react';

interface BipolarDivergenceGraphProps {
  eventTime?: number;
}

export function BipolarDivergenceGraph({ eventTime }: BipolarDivergenceGraphProps) {
  // Generate data centered around event time
  const centerPoint = eventTime ? Math.floor(eventTime % 10) : 5;
  const dataPoints = Array.from({ length: 50 }, (_, i) => {
    // Create more divergence near the event time
    const distanceFromEvent = Math.abs(i - centerPoint * 5);
    const divergenceFactor = Math.max(0, 1 - distanceFromEvent / 25);
    
    return {
      x: i,
      source: Math.sin(i * 0.2) * 30 + Math.random() * 10,
      dub: Math.sin(i * 0.2 + 0.5) * 30 + Math.random() * 10 + (divergenceFactor * 15)
    };
  });
  
  // Calculate average divergence
  const avgDivergence = dataPoints.reduce((sum, d) => sum + Math.abs(d.source - d.dub), 0) / dataPoints.length;
  const variancePercent = Math.round((avgDivergence / 30) * 100);

  return (
    <div className="p-4 bg-slate-900/40 rounded-lg border border-slate-800">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Prosody Divergence {eventTime && <span className="text-cyan-400">@ {eventTime.toFixed(1)}s</span>}
        </h4>
        <p className="text-[9px] text-slate-500 max-w-[55%] text-right leading-relaxed">
          Shows emotional tone differences at this event
        </p>
      </div>

      <div className="relative h-32 bg-slate-950/50 rounded border border-slate-800">
        <svg className="w-full h-full" viewBox="0 0 500 128">
          {/* Center line */}
          <line x1="0" y1="64" x2="500" y2="64" stroke="rgb(71 85 105)" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Event marker */}
          {eventTime && (
            <line 
              x1={centerPoint * 50} 
              y1="10" 
              x2={centerPoint * 50} 
              y2="118" 
              stroke="rgb(34 211 238)" 
              strokeWidth="2" 
              strokeDasharray="4 4"
              opacity="0.5"
            />
          )}
          
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
        <span className={`font-semibold ${variancePercent > 30 ? 'text-red-400' : variancePercent > 20 ? 'text-amber-400' : 'text-green-400'}`}>
          Variance: {variancePercent}%
        </span>
      </div>
    </div>
  );
}
