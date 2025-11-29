/**
 * AudioPanel Component for DubFlow
 * Audio playback controls and track info
 */

import React, { useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  Radio, Activity, Waves, Repeat, Music, Mic
} from 'lucide-react';

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
  const [trackMode, setTrackMode] = useState('full');
  const [soloL, setSoloL] = useState(false);
  const [soloR, setSoloR] = useState(false);
  const [spectralView, setSpectralView] = useState(false);
  const [phaseInvert, setPhaseInvert] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [loopEnabled, setLoopEnabled] = useState(false);

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

      {/* Professional Audio Tools */}
      <div className="px-4 py-3 border-t border-slate-800 space-y-3">
        {/* Track Separation */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Track Mode
          </label>
          <select
            value={trackMode}
            onChange={(e) => setTrackMode(e.target.value)}
            className="w-full px-2 py-1.5 text-xs bg-slate-950 border border-slate-700 text-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          >
            <option value="full">Full Mix</option>
            <option value="vocals">Vocals Only</option>
            <option value="music">Music Only</option>
            <option value="fx">FX Only</option>
          </select>
        </div>

        {/* Channel Solo/Mute */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Channel Control
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setSoloL(!soloL)}
              className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                soloL
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Radio className="w-3 h-3 inline mr-1" />
              L
            </button>
            <button
              onClick={() => setSoloR(!soloR)}
              className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                soloR
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Radio className="w-3 h-3 inline mr-1" />
              R
            </button>
            <button
              className="flex-1 px-2 py-1.5 text-xs font-semibold bg-slate-800 text-slate-400 hover:bg-slate-700 rounded-md transition-colors"
            >
              <Mic className="w-3 h-3 inline mr-1" />
              ST
            </button>
          </div>
        </div>

        {/* Spectral Preview */}
        <button
          onClick={() => setSpectralView(!spectralView)}
          className={`w-full px-3 py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${
            spectralView
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Activity className="w-3 h-3" />
          Spectral View
        </button>

        {/* Phase Inversion */}
        <button
          onClick={() => setPhaseInvert(!phaseInvert)}
          className={`w-full px-3 py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${
            phaseInvert
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Waves className="w-3 h-3" />
          Phase Invert
        </button>

        {/* Playback Speed */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Playback Speed
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[0.5, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  playbackSpeed === speed
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Loop Region */}
        <button
          onClick={() => setLoopEnabled(!loopEnabled)}
          className={`w-full px-3 py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${
            loopEnabled
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Repeat className="w-3 h-3" />
          Loop Region
        </button>
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
