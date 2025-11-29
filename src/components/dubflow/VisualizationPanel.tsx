/**
 * Visualization Panel - Expandable from right with visual debugging tools
 * UI-only with mock data
 */

import React from 'react';
import { X, TrendingUp, Scissors, AlertTriangle, Eye, BarChart3, Radio } from 'lucide-react';

interface VisualizationPanelProps {
  isOpen: boolean;
  selectedIssue: {
    id: number;
    type: string;
    categoryId?: string;
    severity: 'error' | 'warning' | 'info';
    timeSeconds: number;
  } | null;
  onClose: () => void;
  embedded?: boolean; // For embedding in tabs vs overlay
}

export function VisualizationPanel({ isOpen, selectedIssue, onClose, embedded = false }: VisualizationPanelProps) {
  if (!isOpen && !embedded) return null;
  if (!selectedIssue) {
    return embedded ? (
      <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
        Select an issue to view visualizations
      </div>
    ) : null;
  }

  const isEmotional = selectedIssue.categoryId === 'dialogue_integrity' || selectedIssue.type.toLowerCase().includes('tone');
  const isTruncated = selectedIssue.type.toLowerCase().includes('cutoff') || selectedIssue.type.toLowerCase().includes('truncat');
  const isArtifact = selectedIssue.type.toLowerCase().includes('metallic') || selectedIssue.type.toLowerCase().includes('robot');
  const isLipSync = selectedIssue.categoryId === 'timing_sync';
  const isSyncDrift = selectedIssue.type.toLowerCase().includes('sync') || selectedIssue.type.toLowerCase().includes('drift');
  const isChannelIssue = selectedIssue.categoryId === 'channel_integrity';

  // Conditional wrapper based on mode
  const containerClass = embedded 
    ? "bg-slate-950/40 rounded-md border border-slate-800 flex flex-col overflow-hidden"
    : `absolute right-0 top-0 bottom-0 w-[420px] bg-slate-900/95 backdrop-blur-md border-l border-slate-700 shadow-2xl z-50 transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`;
  
  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="h-10 border-b border-slate-800 flex items-center justify-between px-3 bg-slate-950/60 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">Visual Analysis</span>
        </div>
        {!embedded && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content - Scrollable */}
      <div className="h-[calc(100%-2.5rem)] overflow-y-auto p-3 space-y-3">
        {/* Issue Header */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-md p-2.5">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Issue Type</div>
          <div className="text-sm font-bold text-cyan-400">{selectedIssue.type}</div>
          <div className="text-[10px] text-slate-600 mt-0.5">@ {selectedIssue.timeSeconds.toFixed(2)}s</div>
        </div>

        {/* Bipolar Divergence Graph - Emotional Disconnect */}
        {isEmotional && (
          <VisualizationCard 
            title="Bipolar Divergence Graph" 
            subtitle="Emotional Disconnect Detection"
            icon={<TrendingUp className="w-4 h-4" />}
          >
            <div className="relative h-32 bg-slate-950 rounded border border-slate-800 p-2">
              {/* Ghost waveform (source) */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path
                  d="M 0 64 Q 20 20, 40 64 T 80 64 T 120 64 T 160 64 T 200 64 T 240 64 T 280 64 T 320 64 T 360 64 T 400 64"
                  stroke="#475569"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.4"
                />
              </svg>
              
              {/* Dub curve (solid) */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path
                  d="M 0 64 Q 20 50, 40 64 T 80 64 T 120 64 T 160 70 T 200 64 T 240 60 T 280 64 T 320 64 T 360 68 T 400 64"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              
              {/* Red delta spikes */}
              {[60, 140, 220, 340].map((x, i) => (
                <div
                  key={i}
                  className="absolute w-1 bg-red-500 opacity-70"
                  style={{
                    left: `${x}px`,
                    top: '20px',
                    height: `${20 + Math.random() * 30}px`
                  }}
                />
              ))}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              <span className="text-red-400 font-bold">↓ 23% emotional energy</span> vs source
            </div>
          </VisualizationCard>
        )}

        {/* Zero-Crossing Hazard Marker - Truncated Audio */}
        {isTruncated && (
          <VisualizationCard 
            title="Zero-Crossing Hazard Marker" 
            subtitle="Truncation Detection"
            icon={<Scissors className="w-4 h-4" />}
          >
            <div className="relative h-24 bg-slate-950 rounded border border-slate-800 p-2 overflow-hidden">
              {/* Waveform leading to cutoff */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path
                  d="M 0 48 Q 50 20, 100 48 T 200 48 T 250 48"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              
              {/* Neon pink cutoff line */}
              <div className="absolute right-12 top-0 bottom-0 w-1 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.6)]" />
              
              {/* Phantom dotted tail */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path
                  d="M 280 48 Q 300 30, 320 48 T 360 48"
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  fill="none"
                  opacity="0.3"
                />
              </svg>
            </div>
            <div className="mt-2 text-xs text-pink-400 font-bold">
              ⚠️ Non-zero crossing detected: +0.24 amplitude
            </div>
          </VisualizationCard>
        )}

        {/* Artifact Heatmap - Metallic/Robotic */}
        {isArtifact && (
          <VisualizationCard 
            title="Artifact Heatmap" 
            subtitle="Frequency Analysis"
            icon={<AlertTriangle className="w-4 h-4" />}
          >
            <div className="relative h-40 bg-slate-950 rounded border border-slate-800 p-2">
              {/* Mock spectrogram with color zones */}
              <div className="grid grid-cols-20 gap-px h-full">
                {Array.from({ length: 100 }).map((_, i) => {
                  const intensity = Math.random();
                  const isArtifact = intensity > 0.7;
                  return (
                    <div
                      key={i}
                      className="transition-all"
                      style={{
                        backgroundColor: isArtifact 
                          ? intensity > 0.85 ? '#ef4444' : '#fb923c'
                          : `rgba(59, 130, 246, ${intensity * 0.6})`
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span className="text-slate-500">Clean</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded" />
                <span className="text-slate-500">Warning</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span className="text-slate-500">Artifacts</span>
              </div>
            </div>
          </VisualizationCard>
        )}

        {/* Viseme Connector Strip - Lip Sync */}
        {isLipSync && (
          <VisualizationCard 
            title="Viseme Connector Strip" 
            subtitle="Lip-Sync Physics Analysis"
            icon={<Eye className="w-4 h-4" />}
          >
            <div className="space-y-3">
              {/* Video mouth crop mockup */}
              <div className="h-20 bg-slate-950 rounded border border-slate-800 flex items-center justify-center">
                <div className="w-16 h-8 bg-gradient-to-r from-pink-900/40 to-pink-800/40 rounded-full border-2 border-pink-700/50" />
              </div>
              
              {/* Phoneme shapes with connector lines */}
              <div className="relative">
                <div className="flex justify-around py-2">
                  {/* Phoneme indicators */}
                  {['closed', 'open', 'closed', 'open', 'closed'].map((shape, i) => (
                    <div
                      key={i}
                      className={`${
                        shape === 'open' 
                          ? 'w-4 h-4 rounded-full' 
                          : 'w-4 h-2 rounded-sm'
                      } ${i === 2 ? 'bg-red-500' : 'bg-cyan-500/40'} border border-slate-700`}
                    />
                  ))}
                </div>
                
                {/* Red mismatch line */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <line 
                    x1="50%" 
                    y1="0" 
                    x2="50%" 
                    y2="100%" 
                    stroke="#ef4444" 
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-xs text-red-400 font-bold">
              ⚠️ Viseme mismatch at frame 2: Expected open, got closed
            </div>
          </VisualizationCard>
        )}

        {/* Sync-Drift Bar */}
        {isSyncDrift && (
          <VisualizationCard 
            title="Sync-Drift Bar" 
            subtitle="Timing Deviation Analysis"
            icon={<BarChart3 className="w-4 h-4" />}
          >
            <div className="space-y-2">
              {/* Center line */}
              <div className="relative h-16 flex items-center">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-700" />
                
                {/* Drift bars */}
                <div className="w-full flex items-center justify-center gap-px">
                  {/* Early (left) */}
                  <div className="flex-1 flex justify-end">
                    <div 
                      className="h-8 bg-blue-500/60 rounded-l"
                      style={{ width: '30%' }}
                    />
                  </div>
                  
                  {/* Late (right) - RED for out of tolerance */}
                  <div className="flex-1">
                    <div 
                      className="h-12 bg-red-500 rounded-r animate-pulse"
                      style={{ width: '65%' }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Labels */}
              <div className="flex justify-between text-xs">
                <span className="text-blue-400">← Early</span>
                <span className="text-slate-600">0ms</span>
                <span className="text-red-400">Late →</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-red-400 font-bold">
              ⚠️ +180ms drift exceeds tolerance (±100ms)
            </div>
          </VisualizationCard>
        )}

        {/* Channel Health Matrix - 5.1 Layout */}
        {isChannelIssue && (
          <VisualizationCard 
            title="Channel Health Matrix" 
            subtitle="5.1 Surround Layout"
            icon={<Radio className="w-4 h-4" />}
          >
            <div className="grid grid-cols-3 gap-3">
              {/* Front Channels */}
              <ChannelIndicator label="L" status="healthy" />
              <ChannelIndicator label="C" status="phase" />
              <ChannelIndicator label="R" status="healthy" />
              
              {/* Rear + LFE */}
              <ChannelIndicator label="Ls" status="missing" />
              <ChannelIndicator label="LFE" status="healthy" />
              <ChannelIndicator label="Rs" status="healthy" />
            </div>
            <div className="mt-3 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-slate-500">Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-slate-500">Phase Issue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-slate-500">Missing/Corrupt</span>
              </div>
            </div>
          </VisualizationCard>
        )}

        {/* BONUS: Phase Wheel */}
        <VisualizationCard 
          title="Phase Wheel" 
          subtitle="L/R Correlation Meter"
          icon={<Radio className="w-4 h-4" />}
        >
          <div className="flex items-center justify-center h-32 bg-slate-950 rounded border border-slate-800">
            <div className="relative w-24 h-24">
              {/* Outer circle */}
              <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="1" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="#334155" strokeWidth="1" />
                <circle cx="50" cy="50" r="25" fill="none" stroke="#334155" strokeWidth="1" />
                
                {/* Phase indicator */}
                <line 
                  x1="50" 
                  y1="50" 
                  x2="75" 
                  y2="30" 
                  stroke="#06b6d4" 
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="75" cy="30" r="3" fill="#06b6d4" />
              </svg>
              
              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-500 rounded-full" />
            </div>
          </div>
          <div className="mt-2 text-xs text-center text-slate-500">
            Correlation: <span className="text-cyan-400 font-bold">+0.87</span> (Good)
          </div>
        </VisualizationCard>

        {/* BONUS: Dynamic Range Strip */}
        <VisualizationCard 
          title="Dynamic Range Meter" 
          subtitle="DR Analysis"
          icon={<BarChart3 className="w-4 h-4" />}
        >
          <div className="space-y-2">
            {/* Meter bars */}
            {['Peak', 'RMS', 'Floor'].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-12">{label}</span>
                <div className="flex-1 h-4 bg-slate-950 rounded border border-slate-800 overflow-hidden">
                  <div 
                    className={`h-full ${
                      i === 0 ? 'bg-gradient-to-r from-green-500 to-yellow-500' :
                      i === 1 ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                      'bg-gradient-to-r from-slate-600 to-slate-700'
                    }`}
                    style={{ width: `${85 - i * 20}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 font-mono w-12">-{i * 6}dB</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Dynamic Range: <span className="text-green-400 font-bold">14.2 dB</span>
          </div>
        </VisualizationCard>

        {/* BONUS: Noise Fingerprint */}
        <VisualizationCard 
          title="Noise Fingerprint" 
          subtitle="Mini-Spectrogram"
          icon={<AlertTriangle className="w-4 h-4" />}
        >
          <div className="h-24 bg-slate-950 rounded border border-slate-800 p-1">
            <div className="grid grid-cols-30 grid-rows-8 gap-px h-full">
              {Array.from({ length: 240 }).map((_, i) => {
                const hasNoise = Math.random() > 0.85;
                const intensity = Math.random();
                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: hasNoise 
                        ? `rgba(234, 88, 12, ${intensity})` 
                        : `rgba(59, 130, 246, ${intensity * 0.3})`
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Noise floor: <span className="text-orange-400 font-bold">-54dB</span> (elevated)
          </div>
        </VisualizationCard>
      </div>
    </div>
  );
}

// Helper Components
function VisualizationCard({ 
  title, 
  subtitle, 
  icon, 
  children 
}: { 
  title: string; 
  subtitle: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-md p-2.5 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-cyan-400">{icon}</div>
        <div className="flex-1">
          <div className="text-[11px] font-bold text-slate-200">{title}</div>
          <div className="text-[9px] text-slate-500">{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function ChannelIndicator({ 
  label, 
  status 
}: { 
  label: string; 
  status: 'healthy' | 'phase' | 'missing';
}) {
  const statusColors = {
    healthy: 'bg-green-500/20 border-green-500/50 text-green-400',
    phase: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    missing: 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
  };

  return (
    <div className={`aspect-square rounded-lg border-2 ${statusColors[status]} flex items-center justify-center font-bold text-sm`}>
      {label}
    </div>
  );
}