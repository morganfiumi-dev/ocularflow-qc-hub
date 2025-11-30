/**
 * DubFlow Audio Toolbar
 * Small controls above the waveform
 */

import React from 'react';
import { Volume2, VolumeX, Repeat, Activity, FlipVertical } from 'lucide-react';

interface AudioToolbarProps {
  spectrogramMode: boolean;
  loopMode: boolean;
  onToggleSpectrogram: () => void;
  onToggleLoop: () => void;
}

export function AudioToolbar({
  spectrogramMode,
  loopMode,
  onToggleSpectrogram,
  onToggleLoop
}: AudioToolbarProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/40 border-b border-slate-800">
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleSpectrogram}
          className={`p-1.5 rounded transition-colors text-xs ${
            spectrogramMode
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-700'
          }`}
          title="Toggle Spectrogram"
        >
          <Activity className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onToggleLoop}
          className={`p-1.5 rounded transition-colors text-xs ${
            loopMode
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-700'
          }`}
          title="Toggle Loop"
        >
          <Repeat className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-slate-700" />

      <div className="flex items-center gap-1">
        <span className="text-[9px] text-slate-500 uppercase tracking-wider mr-1">Channel:</span>
        {['L', 'C', 'R'].map((ch) => (
          <button
            key={ch}
            className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-700 transition-colors"
            title={`Solo ${ch}`}
          >
            {ch}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-slate-700" />

      <button
        className="px-2 py-0.5 rounded text-[9px] font-semibold bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-700 transition-colors uppercase tracking-wider"
        title="Normalize Audio"
      >
        Normalize
      </button>

      <button
        className="p-1.5 rounded text-xs bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-700 transition-colors"
        title="Phase Invert"
      >
        <FlipVertical className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
