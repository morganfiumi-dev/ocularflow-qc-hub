/**
 * Waveform Component for DubFlow
 * Audio waveform visualization with scrubber
 */

import React, { useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';

interface DialogueLine {
  id: number;
  timeInSeconds: number;
  timeOutSeconds: number;
  enText: string;
  dubText: string;
}

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
    description: string;
    categoryId?: string;
    checkId?: string;
  }>;
  dialogueLines: DialogueLine[];
}

export function Waveform({
  currentTime,
  duration,
  zoomLevel,
  onSeek,
  onZoomIn,
  onZoomOut,
  issues,
  dialogueLines
}: WaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const [regionStart, setRegionStart] = useState<number | null>(null);
  const [regionEnd, setRegionEnd] = useState<number | null>(null);
  const [timelinePrecision, setTimelinePrecision] = useState<'fine' | 'medium' | 'coarse'>('medium');
  const [hoveredIssue, setHoveredIssue] = useState<number | null>(null);

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
            Waveform • Multi-Language View
          </h3>
          <div className="font-mono text-sm text-cyan-400">
            {formatTimecode(currentTime)}
          </div>
          <div className="text-[10px] text-slate-600">
            {issues.length} issues • {dialogueLines.length} lines
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

          {/* Dialogue pills - overlayed on waveform with multi-language support */}
          {dialogueLines.map((line) => {
            const startPercent = (line.timeInSeconds / duration) * 100;
            const widthPercent = ((line.timeOutSeconds - line.timeInSeconds) / duration) * 100;
            
            return (
              <div
                key={line.id}
                className="absolute bottom-2 cursor-pointer transition-all hover:bottom-3"
                style={{
                  left: `${startPercent}%`,
                  width: `${widthPercent}%`
                }}
              >
                {/* EN source line (top) */}
                <div className="mb-0.5 h-6 bg-slate-700/30 border border-slate-600/50 rounded-sm flex items-center px-2 hover:bg-slate-700/50 transition-colors">
                  <span className="text-[8px] text-slate-400 truncate font-mono">
                    EN: {line.enText}
                  </span>
                </div>
                
                {/* Dubbed line (bottom) - more prominent */}
                <div className="h-7 bg-purple-500/30 border-2 border-purple-500/60 rounded-sm flex items-center px-2 hover:bg-purple-500/40 hover:border-purple-400 transition-colors shadow-lg">
                  <span className="text-[9px] text-purple-200 truncate font-semibold font-mono">
                    {line.dubText}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Issue markers - VERY PROMINENT with detailed hover tooltip */}
          {issues.map((issue) => {
            const percent = (issue.timeSeconds / duration) * 100;
            const isHovered = hoveredIssue === issue.id;
            
            // Determine visual prominence based on category
            const isLipSync = issue.categoryId === 'timing_sync';
            const isDialogue = issue.categoryId === 'dialogue_integrity';
            const isTranslation = issue.categoryId === 'translation';
            
            return (
              <div
                key={issue.id}
                className={`absolute top-0 bottom-0 cursor-pointer transition-all z-20 ${
                  isHovered ? 'w-3' : 'w-2'
                }`}
                style={{ left: `${percent}%` }}
                onMouseEnter={() => setHoveredIssue(issue.id)}
                onMouseLeave={() => setHoveredIssue(null)}
              >
                {/* Marker line - thicker and more visible */}
                <div className={`absolute inset-0 ${getSeverityColor(issue.severity)} opacity-90`} />
                
                {/* Marker dot with glow */}
                <div className={`absolute top-1 left-1/2 -translate-x-1/2 rounded-full ${getSeverityColor(issue.severity)} ${
                  isHovered ? 'w-4 h-4 shadow-lg' : 'w-3 h-3'
                } shadow-[0_0_8px_rgba(255,255,255,0.5)]`} />
                
                {/* Category indicator icon */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center text-[10px]">
                  {isLipSync && '👄'}
                  {isDialogue && '💬'}
                  {isTranslation && '🌐'}
                  {!isLipSync && !isDialogue && !isTranslation && '⚠️'}
                </div>
                
                {/* Enhanced hover tooltip with category info */}
                {isHovered && (
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900 border-2 border-slate-700 rounded-lg p-4 shadow-2xl z-50 min-w-[280px] max-w-[320px]">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(issue.severity)} shadow-lg`} />
                      <span className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                        {issue.severity}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-auto font-mono">{issue.timecode}</span>
                    </div>
                    
                    {/* Category badge */}
                    <div className="mb-2">
                      <span className={`inline-block px-2 py-1 text-[10px] font-semibold rounded ${
                        isLipSync ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
                        isDialogue ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        isTranslation ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {isLipSync && '👄 LIP SYNC'}
                        {isDialogue && '💬 DIALOGUE'}
                        {isTranslation && '🌐 TRANSLATION'}
                        {!isLipSync && !isDialogue && !isTranslation && '⚠️ AUDIO'}
                      </span>
                    </div>
                    
                    {/* Issue type */}
                    <div className="text-sm text-cyan-400 font-bold mb-2">{issue.type}</div>
                    
                    {/* Description */}
                    <div className="text-xs text-slate-300 leading-relaxed">{issue.description}</div>
                    
                    {/* Script Doctor hint for relevant issues */}
                    {(isLipSync || isDialogue || isTranslation) && (
                      <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-purple-400">
                        💡 Click in Inspector to open Script Doctor
                      </div>
                    )}
                  </div>
                )}
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
