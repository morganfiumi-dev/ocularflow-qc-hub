/**
 * DubFlow Audio Toolbar
 * Small controls above the waveform
 */

import React from 'react';
import { Volume2, VolumeX, Repeat, Activity, FlipVertical, ChevronRight, AlertTriangle } from 'lucide-react';

interface AudioToolbarProps {
  spectrogramMode: boolean;
  loopMode: boolean;
  onToggleSpectrogram: () => void;
  onToggleLoop: () => void;
  onNextSubtitle?: () => void;
  onNextIncident?: () => void;
}

export function AudioToolbar({
  spectrogramMode,
  loopMode,
  onToggleSpectrogram,
  onToggleLoop,
  onNextSubtitle,
  onNextIncident
}: AudioToolbarProps) {
  const [activeChannels, setActiveChannels] = React.useState({ L: true, C: true, R: true });
  const [normalized, setNormalized] = React.useState(false);
  const [phaseInverted, setPhaseInverted] = React.useState(false);
  const [showAnnotations, setShowAnnotations] = React.useState(true);

  const toggleChannel = (channel: 'L' | 'C' | 'R') => {
    setActiveChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/40 border-b border-slate-800">
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleSpectrogram}
          className={`p-1.5 rounded transition-all text-xs ${
            spectrogramMode
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-700'
          }`}
          title="Toggle Spectrogram"
        >
          <Activity className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onToggleLoop}
          className={`p-1.5 rounded transition-all text-xs ${
            loopMode
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-700'
          }`}
          title="Toggle Loop"
        >
          <Repeat className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setShowAnnotations(!showAnnotations)}
          className={`px-2 py-0.5 rounded text-[9px] font-semibold transition-all ${
            showAnnotations
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-700'
          }`}
          title="Show scene markers"
        >
          SCENES
        </button>
      </div>

      <div className="h-4 w-px bg-slate-700" />

      <div className="flex items-center gap-1.5">
        <span className="text-[9px] text-slate-500 uppercase tracking-wider">Channel:</span>
        {Object.entries(activeChannels).map(([ch, active]) => (
          <button
            key={ch}
            onClick={() => toggleChannel(ch as 'L' | 'C' | 'R')}
            className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
              active
                ? 'bg-green-500/20 text-green-400 border border-green-500/40 shadow-sm'
                : 'bg-slate-800/60 text-slate-600 border border-slate-700/50 hover:bg-slate-700'
            }`}
            title={`${active ? 'Mute' : 'Unmute'} ${ch} channel`}
          >
            {ch}
            {active && (
              <span className="inline-block w-1 h-1 rounded-full bg-green-400 ml-1 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-slate-700" />

      <button
        onClick={() => setNormalized(!normalized)}
        className={`px-2 py-0.5 rounded text-[9px] font-semibold transition-all uppercase tracking-wider ${
          normalized
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-700'
        }`}
        title="Normalize Audio"
      >
        {normalized ? '0dB' : 'Normalize'}
      </button>

      <button
        onClick={() => setPhaseInverted(!phaseInverted)}
        className={`p-1.5 rounded text-xs transition-all ${
          phaseInverted
            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
            : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-700'
        }`}
        title="Phase Invert"
      >
        <FlipVertical className="w-3.5 h-3.5" />
      </button>

      <div className="flex-1" />

      {/* Navigation Controls */}
      <div className="flex items-center gap-1.5">
        {onNextSubtitle && (
          <button
            onClick={onNextSubtitle}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all"
            title="Jump to next subtitle (N)"
          >
            <ChevronRight className="w-3 h-3" />
            NEXT SUB
          </button>
        )}
        {onNextIncident && (
          <button
            onClick={onNextIncident}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all"
            title="Jump to next incident (I)"
          >
            <AlertTriangle className="w-3 h-3" />
            NEXT ISSUE
          </button>
        )}
      </div>
    </div>
  );
}
