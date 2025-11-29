/**
 * AudioPlaybackControls - Standard playback controls for DubFlow
 * Reuses transport control patterns from OcularFlow
 */

import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Volume2,
  VolumeX
} from 'lucide-react';

interface AudioPlaybackControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  muted: boolean;
  onTogglePlayback: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onFrameForward: () => void;
  onFrameBackward: () => void;
  onSeek: (time: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

const formatTimecode = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const f = Math.floor((seconds % 1) * 24);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
};

export function AudioPlaybackControls({
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  volume,
  muted,
  onTogglePlayback,
  onSkipForward,
  onSkipBackward,
  onFrameForward,
  onFrameBackward,
  onPlaybackRateChange,
  onVolumeChange,
  onToggleMute,
}: AudioPlaybackControlsProps) {
  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="h-full flex items-center justify-between px-4 bg-slate-900/60">
      {/* Left: Transport controls */}
      <div className="flex items-center gap-2">
        {/* Frame backward */}
        <button
          onClick={onFrameBackward}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
          title="Frame backward (,)"
        >
          <Rewind className="w-4 h-4" />
        </button>

        {/* Skip backward */}
        <button
          onClick={onSkipBackward}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
          title="Skip backward 5s (←)"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Play/Pause */}
        <button
          onClick={onTogglePlayback}
          className="p-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors"
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        {/* Skip forward */}
        <button
          onClick={onSkipForward}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
          title="Skip forward 5s (→)"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Frame forward */}
        <button
          onClick={onFrameForward}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
          title="Frame forward (.)"
        >
          <FastForward className="w-4 h-4" />
        </button>

        {/* Timecode display */}
        <div className="ml-3 font-mono text-sm text-cyan-400">
          {formatTimecode(currentTime)} / {formatTimecode(duration)}
        </div>
      </div>

      {/* Right: Rate and volume */}
      <div className="flex items-center gap-3">
        {/* Playback rate */}
        <select
          className="px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-300 focus:outline-none focus:border-cyan-500"
          value={playbackRate}
          onChange={(e) => onPlaybackRateChange(parseFloat(e.target.value))}
        >
          {playbackRates.map(rate => (
            <option key={rate} value={rate}>
              {rate}x
            </option>
          ))}
        </select>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={muted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-20 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-3
                       [&::-webkit-slider-thumb]:h-3
                       [&::-webkit-slider-thumb]:bg-cyan-500
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
