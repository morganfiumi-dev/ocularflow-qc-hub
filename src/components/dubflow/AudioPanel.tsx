/**
 * AudioPanel Component for DubFlow
 * Audio playback controls and track info
 */

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface AudioPanelProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  language: string;
  codec: string;
  onTogglePlay: () => void;
  onJumpBackward: () => void;
  onJumpForward: () => void;
  onVolumeChange: (volume: number) => void;
  volume: number;
}

export function AudioPanel({
  isPlaying,
  currentTime,
  duration,
  language,
  codec,
  onTogglePlay,
  onJumpBackward,
  onJumpForward,
  onVolumeChange,
  volume
}: AudioPanelProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/60 border border-slate-800 rounded-lg shadow-lg shadow-black/40">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Audio Player
        </h3>
      </div>

      {/* VU Meter Placeholder */}
      <div className="flex-1 p-4">
        <div className="h-full bg-slate-950 border border-slate-800 rounded-md flex items-center justify-center">
          <div className="space-y-2 w-full px-8">
            {/* Mock VU meters */}
            {[0, 1].map((channel) => (
              <div key={channel} className="space-y-1">
                <span className="text-[10px] text-slate-600 uppercase">
                  Ch {channel + 1}
                </span>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all"
                    style={{ width: `${40 + Math.random() * 40}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Track Info */}
      <div className="px-4 py-3 border-t border-slate-800 space-y-2">
        <div className="text-xs">
          <span className="text-slate-500">Language:</span>
          <span className="text-slate-100 ml-2 font-semibold">{language}</span>
        </div>
        <div className="text-xs">
          <span className="text-slate-500">Codec:</span>
          <span className="text-slate-100 ml-2 font-mono">{codec}</span>
        </div>
        <div className="text-xs">
          <span className="text-slate-500">Duration:</span>
          <span className="text-slate-100 ml-2 font-mono">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="px-4 py-4 border-t border-slate-800 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onJumpBackward}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button
            onClick={onTogglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          
          <button
            onClick={onJumpForward}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Timecode */}
        <div className="text-center font-mono text-sm text-slate-300">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-slate-500" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-slate-500 font-mono w-8">
            {volume}%
          </span>
        </div>
      </div>
    </div>
  );
}
