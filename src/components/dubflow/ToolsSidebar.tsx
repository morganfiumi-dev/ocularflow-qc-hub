/**
 * ToolsSidebar - Collapsible left tools panel for DubFlow
 * UI-only component showing audio meters and controls
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Activity, Volume2, Waves, Radio } from 'lucide-react';
import { Button } from '../atoms/Button';

interface ToolsSidebarProps {
  collapsed?: boolean;
}

export function ToolsSidebar({ collapsed = false }: ToolsSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsed);
  
  // Mock values for UI display
  const isPlaying = false;
  const currentTime = 0;
  const volume = 75;
  const profileCode = 'NFLX-ES';

  const formatTimecode = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 24);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  // Mock VU meter values (UI-only)
  const vuLeft = isPlaying ? Math.random() * 100 : 0;
  const vuRight = isPlaying ? Math.random() * 100 : 0;
  const lufs = isPlaying ? -23 + Math.random() * 3 : -23;

  if (!isExpanded) {
    return (
      <div className="w-20 bg-slate-900/60 border border-slate-800 rounded-md shadow-lg shadow-black/40 flex flex-col items-center gap-4 p-3">
        {/* Collapse/Expand toggle */}
        <button
          onClick={() => setIsExpanded(true)}
          className="p-2 hover:bg-slate-800 rounded transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* VU Meter Preview */}
        <div className="flex flex-col gap-2">
          <div className="w-2 h-16 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all"
              style={{ height: `${vuLeft}%`, marginTop: `${100 - vuLeft}%` }}
            />
          </div>
          <div className="w-2 h-16 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all"
              style={{ height: `${vuRight}%`, marginTop: `${100 - vuRight}%` }}
            />
          </div>
        </div>

        {/* Profile badge */}
        <div className="writing-mode-vertical text-[10px] text-slate-500 font-mono">
          {profileCode}
        </div>

        {/* Quick controls icons */}
        <div className="flex flex-col gap-2">
          <Activity className="w-4 h-4 text-slate-600" />
          <Waves className="w-4 h-4 text-slate-600" />
          <Radio className="w-4 h-4 text-slate-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-slate-900/60 border border-slate-800 rounded-md shadow-lg shadow-black/40 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-12 border-b border-slate-800 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-500" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tools</span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1.5 hover:bg-slate-800 rounded transition-colors"
          title="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* VU Meters */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">VU Meters</h3>
          <div className="bg-slate-950/60 rounded p-3 border border-slate-800">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="text-[9px] text-slate-600 uppercase mb-2">L</div>
                <div className="h-32 bg-slate-800 rounded-sm overflow-hidden">
                  <div 
                    className="w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all"
                    style={{ height: `${vuLeft}%`, marginTop: `${100 - vuLeft}%` }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[9px] text-slate-600 uppercase mb-2">R</div>
                <div className="h-32 bg-slate-800 rounded-sm overflow-hidden">
                  <div 
                    className="w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all"
                    style={{ height: `${vuRight}%`, marginTop: `${100 - vuRight}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LUFS */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Loudness</h3>
          <div className="bg-slate-950/60 rounded border border-slate-800 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-slate-600">Integrated</span>
              <span className="text-xs font-mono text-cyan-400">-23.5 LUFS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-slate-600">True Peak</span>
              <span className="text-xs font-mono text-green-400">-2.1 dBTP</span>
            </div>
          </div>
        </div>

        {/* Channel activity */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Channels</h3>
          <div className="grid grid-cols-3 gap-1.5">
            {['L', 'R', 'C', 'LFE', 'LS', 'RS'].map((ch) => (
              <div
                key={ch}
                className="bg-slate-950/60 border border-slate-800 rounded px-2 py-1.5 text-center"
              >
                <div className="text-[9px] text-slate-500 mb-0.5">{ch}</div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audio isolation controls */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Audio Isolation</h3>
          <div className="space-y-1.5">
            <button className="w-full p-2 rounded bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-xs text-slate-300 transition-colors text-left">
              Isolate Dialogue
            </button>
            <button className="w-full p-2 rounded bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/10 text-xs text-slate-300 transition-colors text-left">
              Isolate Music
            </button>
            <button className="w-full p-2 rounded bg-slate-950/60 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-500/10 text-xs text-slate-300 transition-colors text-left">
              Isolate SFX
            </button>
          </div>
        </div>

        {/* Solo/Mute controls */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Solo / Mute</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {['Dialogue', 'Music', 'SFX', 'Ambience'].map((track) => (
              <div key={track} className="flex gap-1">
                <button className="flex-1 px-2 py-1 text-[9px] font-semibold rounded bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 transition-colors">
                  S
                </button>
                <button className="flex-1 px-2 py-1 text-[9px] font-semibold rounded bg-slate-950/60 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-colors">
                  M
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Playback options */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Audio Options</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 hover:border-cyan-500/30 cursor-pointer transition-colors">
              <input type="checkbox" className="w-3 h-3 rounded border-slate-700 bg-slate-900 checked:bg-cyan-500" />
              <span className="text-xs text-slate-300">Normalize</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 hover:border-cyan-500/30 cursor-pointer transition-colors">
              <input type="checkbox" className="w-3 h-3 rounded border-slate-700 bg-slate-900 checked:bg-cyan-500" />
              <span className="text-xs text-slate-300">Phase invert</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 hover:border-cyan-500/30 cursor-pointer transition-colors">
              <input type="checkbox" className="w-3 h-3 rounded border-slate-700 bg-slate-900 checked:bg-cyan-500" />
              <span className="text-xs text-slate-300">Loop region</span>
            </label>
          </div>
        </div>

        {/* Profile info */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">QC Profile</h3>
          <div className="bg-slate-950/60 rounded border border-slate-800 p-3 space-y-1">
            <div className="text-xs text-cyan-400 font-mono">{profileCode}</div>
            <div className="text-[10px] text-slate-500">Netflix Spanish Dub</div>
          </div>
        </div>
      </div>
    </div>
  );
}