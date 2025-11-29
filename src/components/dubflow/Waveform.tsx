/**
 * Waveform Component for DubFlow
 * Audio waveform visualization with scrubber
 */

import React, { useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';

interface WaveformProps {
  currentTime: number;
  duration: number;
  zoomLevel: number;
  onSeek: (time: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  issues: Array<{ 
    id: number; 
    timecode: string; 
    timeSeconds: number; 
    type: string; 
    severity: 'error' | 'warning' | 'info';
  }>;
}

export function Waveform({
  currentTime,
  duration,
  zoomLevel,
  onSeek,
  onZoomIn,
  onZoomOut,
  issues
}: WaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const [regionStart, setRegionStart] = useState<number | null>(null);
  const [regionEnd, setRegionEnd] = useState<number | null>(null);
  const [timelinePrecision, setTimelinePrecision] = useState<'fine' | 'medium' | 'coarse'>('medium');

  // Generate mock waveform bars
  const barCount = 200;
  const bars = Array.from({ length: barCount }, (_, i) => {
    const normalized = i / barCount;
    const wave = Math.sin(normalized * Math.PI * 8) * 0.5 + 0.5;
    const noise = Math.random() * 0.3;
    return Math.min(1, (wave + noise) * 0.8);
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const time = percent * duration;
    
    // Region selection mode
    if (e.shiftKey) {
      if (regionStart === null) {
        setRegionStart(time);
      } else {
        setRegionEnd(time);
      }
    } else {
      onSeek(time);
    }
  };

  const handleFitToView = () => {
    // Reset zoom logic placeholder
    console.log('Fit to view');
  };

  const clearRegion = () => {
    setRegionStart(null);
    setRegionEnd(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-500/70 hover:bg-red-500';
      case 'warning': return 'bg-amber-500/70 hover:bg-amber-500';
      default: return 'bg-blue-500/70 hover:bg-blue-500';
    }
  };

  const formatTimecode = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = Math.floor((seconds % 1) * 24);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
  };

  const playheadPercent = (currentTime / duration) * 100;

  return (
    <div className="h-full flex flex-col bg-slate-900/60 border border-slate-800 rounded-lg shadow-lg shadow-black/40">
      {/* Header with timecode and zoom */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Waveform
          </h3>
          <div className="font-mono text-sm text-cyan-400">
            {formatTimecode(currentTime)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeline Precision */}
          <div className="flex items-center gap-1 mr-2">
            {(['fine', 'medium', 'coarse'] as const).map((precision) => (
              <button
                key={precision}
                onClick={() => setTimelinePrecision(precision)}
                className={`px-2 py-1 text-[10px] font-semibold uppercase rounded transition-colors ${
                  timelinePrecision === precision
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                }`}
              >
                {precision[0]}
              </button>
            ))}
          </div>

          {/* Region controls */}
          {(regionStart !== null || regionEnd !== null) && (
            <button
              onClick={clearRegion}
              className="px-2 py-1 text-[10px] font-semibold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded hover:bg-amber-500/30 transition-colors"
            >
              Clear Region
            </button>
          )}

          {/* Zoom controls */}
          <button
            onClick={onZoomOut}
            disabled={zoomLevel <= 0.5}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500 font-mono w-10 text-center">
            {zoomLevel.toFixed(1)}x
          </span>
          <button
            onClick={onZoomIn}
            disabled={zoomLevel >= 4}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleFitToView}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Fit to view"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Waveform visualization */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={waveformRef}
          onClick={handleClick}
          className="h-full bg-slate-950 cursor-pointer relative"
        >
          {/* Waveform bars */}
          <div className="absolute inset-0 flex items-center px-2 gap-0.5">
            {bars.map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-cyan-500/40 rounded-full transition-all"
                style={{
                  height: `${height * 80}%`,
                  opacity: 0.6 + height * 0.4
                }}
              />
            ))}
          </div>

          {/* Region selection highlight */}
          {regionStart !== null && regionEnd !== null && (
            <div
              className="absolute top-0 bottom-0 bg-cyan-500/10 border-l-2 border-r-2 border-cyan-500/50 pointer-events-none"
              style={{
                left: `${Math.min(regionStart, regionEnd) / duration * 100}%`,
                right: `${100 - Math.max(regionStart, regionEnd) / duration * 100}%`
              }}
            />
          )}

          {/* Issue markers - color coded by severity */}
          {issues.map((issue) => {
            const percent = (issue.timeSeconds / duration) * 100;
            return (
              <div
                key={issue.id}
                className={`absolute top-0 bottom-0 w-1 cursor-pointer transition-colors ${getSeverityColor(issue.severity)}`}
                style={{ left: `${percent}%` }}
                title={`${issue.type} at ${issue.timecode}`}
              >
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${getSeverityColor(issue.severity)}`} />
              </div>
            );
          })}

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
            style={{ left: `${playheadPercent}%` }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-400 rounded-full shadow-lg" />
          </div>
        </div>
      </div>

      {/* Timeline scale */}
      <div className="px-4 py-2 border-t border-slate-800 flex justify-between text-xs text-slate-500 font-mono">
        <span>00:00:00:00</span>
        <span>{formatTimecode(duration / 2)}</span>
        <span>{formatTimecode(duration)}</span>
      </div>
    </div>
  );
}
