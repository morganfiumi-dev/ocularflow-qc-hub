/**
 * Waveform Component for DubFlow
 * Audio waveform visualization with scrubber
 */

import React, { useRef } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface WaveformProps {
  currentTime: number;
  duration: number;
  zoomLevel: number;
  onSeek: (time: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  issues: Array<{ id: number; time: string; timeSeconds: number; type: string }>;
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
    onSeek(time);
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

          {/* Issue markers */}
          {issues.map((issue) => {
            const percent = (issue.timeSeconds / duration) * 100;
            return (
              <div
                key={issue.id}
                className="absolute top-0 bottom-0 w-0.5 bg-red-500/60 cursor-pointer hover:bg-red-500 transition-colors"
                style={{ left: `${percent}%` }}
                title={`${issue.type} at ${issue.time}`}
              />
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
