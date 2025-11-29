/**
 * AudioPanel Component for DubFlow
 * Audio playback controls and track info
 */

import React, { useState, useEffect, useRef } from 'react';
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

  // Audio visualization state
  const [vuLevels, setVuLevels] = useState({ left: 0, right: 0 });
  const [peakHold, setPeakHold] = useState({ left: 0, right: 0 });
  const spectrumCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate real-time VU meter animation
  useEffect(() => {
    if (!isPlaying) {
      setVuLevels({ left: 0, right: 0 });
      return;
    }

    const animate = () => {
      // Simulate audio levels with realistic movement
      const newLeft = Math.random() * 0.6 + 0.2; // 20-80% range
      const newRight = Math.random() * 0.6 + 0.2;
      
      setVuLevels({ left: newLeft, right: newRight });

      // Peak hold with decay
      setPeakHold(prev => ({
        left: Math.max(prev.left * 0.95, newLeft),
        right: Math.max(prev.right * 0.95, newRight)
      }));

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Draw frequency spectrum
  useEffect(() => {
    const canvas = spectrumCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barCount = 32;
    const barWidth = width / barCount;

    const drawSpectrum = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < barCount; i++) {
        // Simulate frequency spectrum with realistic distribution
        // Lower frequencies (left) typically have more energy
        const freqFactor = Math.exp(-i / 8);
        const randomness = Math.random() * 0.4 + 0.6;
        const amplitude = isPlaying ? freqFactor * randomness : 0;
        const barHeight = amplitude * height;

        const x = i * barWidth;
        const y = height - barHeight;

        // Gradient fill - cyan to blue
        const gradient = ctx.createLinearGradient(x, y, x, height);
        
        if (amplitude > 0.8) {
          gradient.addColorStop(0, 'rgb(239, 68, 68)'); // red
          gradient.addColorStop(0.3, 'rgb(251, 146, 60)'); // amber
          gradient.addColorStop(1, 'rgb(34, 211, 238)'); // cyan
        } else if (amplitude > 0.6) {
          gradient.addColorStop(0, 'rgb(251, 146, 60)'); // amber
          gradient.addColorStop(1, 'rgb(34, 211, 238)'); // cyan
        } else {
          gradient.addColorStop(0, 'rgb(34, 211, 238)'); // cyan
          gradient.addColorStop(1, 'rgb(6, 182, 212)'); // cyan-dark
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      }

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(drawSpectrum);
      }
    };

    drawSpectrum();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const getVuColor = (level: number) => {
    if (level > 0.85) return 'bg-red-500';
    if (level > 0.7) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/60 border border-slate-800 rounded-lg shadow-lg shadow-black/40">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Audio Player
        </h3>
      </div>

      {/* Audio Visualization */}
      <div className="flex-1 p-4 space-y-4">
        {/* Professional VU Meters */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              VU Meters
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[8px] text-slate-600">-20</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[8px] text-slate-600">-6</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[8px] text-slate-600">0</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Left Channel */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase">L</span>
                <span className="text-[9px] font-mono text-cyan-400">
                  {(vuLevels.left * 100).toFixed(0)}%
                </span>
              </div>
              <div className="relative h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                {/* Main level bar */}
                <div
                  className={`h-full transition-all duration-75 ${getVuColor(vuLevels.left)}`}
                  style={{ width: `${vuLevels.left * 100}%` }}
                />
                {/* Peak hold indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg transition-all duration-100"
                  style={{ left: `${peakHold.left * 100}%` }}
                />
                {/* Zone markers */}
                <div className="absolute top-0 bottom-0 left-[70%] w-px bg-slate-700" />
                <div className="absolute top-0 bottom-0 left-[85%] w-px bg-slate-700" />
              </div>
            </div>

            {/* Right Channel */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase">R</span>
                <span className="text-[9px] font-mono text-cyan-400">
                  {(vuLevels.right * 100).toFixed(0)}%
                </span>
              </div>
              <div className="relative h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                {/* Main level bar */}
                <div
                  className={`h-full transition-all duration-75 ${getVuColor(vuLevels.right)}`}
                  style={{ width: `${vuLevels.right * 100}%` }}
                />
                {/* Peak hold indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg transition-all duration-100"
                  style={{ left: `${peakHold.right * 100}%` }}
                />
                {/* Zone markers */}
                <div className="absolute top-0 bottom-0 left-[70%] w-px bg-slate-700" />
                <div className="absolute top-0 bottom-0 left-[85%] w-px bg-slate-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Frequency Spectrum */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Frequency Spectrum
            </h4>
            <Activity className="w-3 h-3 text-cyan-500" />
          </div>
          <canvas
            ref={spectrumCanvasRef}
            width={280}
            height={120}
            className="w-full h-[120px] bg-slate-900 rounded border border-slate-800"
          />
          <div className="flex justify-between mt-2">
            <span className="text-[8px] text-slate-600 font-mono">20Hz</span>
            <span className="text-[8px] text-slate-600 font-mono">1kHz</span>
            <span className="text-[8px] text-slate-600 font-mono">20kHz</span>
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
