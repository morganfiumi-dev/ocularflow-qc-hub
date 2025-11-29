/**
 * ToolsSidebar - Collapsible left tools panel for DubFlow
 * UI-only component showing audio meters and controls
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Activity, Volume2, Waves, Radio } from 'lucide-react';
import { Button } from '../atoms/Button';

interface ToolsSidebarProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  language: string;
  codec: string;
  profileCode: string;
  onTogglePlay: () => void;
  onJumpBackward: () => void;
  onJumpForward: () => void;
  onVolumeChange: (volume: number) => void;
}

export function ToolsSidebar({
  isPlaying,
  currentTime,
  duration,
  volume,
  language,
  codec,
  profileCode,
  onTogglePlay,
  onJumpBackward,
  onJumpForward,
  onVolumeChange,
}: ToolsSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

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
        {/* Playback Controls */}
        <div className="space-y-3">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Playback</h3>
          
          <div className="flex items-center gap-2">
            <Button onClick={onJumpBackward} size="sm" variant="secondary">-2s</Button>
            <Button onClick={onTogglePlay} size="sm" variant="primary">
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button onClick={onJumpForward} size="sm" variant="secondary">+2s</Button>
          </div>

          <div className="bg-slate-950/60 rounded p-3 border border-slate-800">
            <div className="text-[9px] text-slate-600 uppercase tracking-wider mb-1">Timecode</div>
            <div className="font-mono text-sm text-cyan-400">{formatTimecode(currentTime)}</div>
          </div>
        </div>

        {/* VU Meters */}
        <div className="space-y-3">
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

        {/* LUFS Meter */}
        <div className="space-y-3">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">LUFS</h3>
          
          <div className="bg-slate-950/60 rounded p-3 border border-slate-800">
            <div className="text-2xl font-mono font-bold text-cyan-400">
              {lufs.toFixed(1)}
            </div>
            <div className="text-[9px] text-slate-600 uppercase tracking-wider">LUFS Integrated</div>
          </div>
        </div>

        {/* Channel Activity */}
        <div className="space-y-3">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Channels</h3>
          
          <div className="bg-slate-950/60 rounded p-3 border border-slate-800 space-y-2">
            {['L', 'R', 'C', 'LFE', 'LS', 'RS'].map(channel => (
              <div key={channel} className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">{channel}</span>
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Volume Control */}
        <div className="space-y-3">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Volume</h3>
          
          <div className="bg-slate-950/60 rounded p-3 border border-slate-800">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-slate-500" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs text-slate-400 font-mono w-10">{volume}%</span>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-3">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Profile</h3>
          
          <div className="bg-slate-950/60 rounded p-3 border border-slate-800 space-y-2">
            <div>
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">Client</div>
              <div className="text-xs text-slate-300 font-mono">{profileCode}</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">Language</div>
              <div className="text-xs text-slate-300 font-mono">{language}</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">Codec</div>
              <div className="text-xs text-slate-300 font-mono">{codec}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}