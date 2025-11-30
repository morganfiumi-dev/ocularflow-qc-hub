/**
 * WaveformControls Component for OcularFlow v10.5
 * Toolbar controls for waveform panel
 */

import React from 'react';
import {
  ChevronRight,
  ChevronDown,
  AlignJustify,
  ArrowRight,
  Activity,
  ZoomOut,
  ZoomIn,
  AlertCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { IconButton, ToggleButton } from '../atoms/Button';

/**
 * WaveformControls component
 * @param {Object} props
 */
export function WaveformControls({
  collapsed = false,
  scrollMode = 'CENTER',
  zoomLevel = 1,
  isolateDialogue = false,
  spectrogramMode = false,
  issueFilters = { error: true, warning: true, info: true },
  onToggleCollapse,
  onScrollModeChange,
  onZoomIn,
  onZoomOut,
  onToggleDialogueIsolation,
  onToggleSpectrogramMode,
  onToggleIssueFilter,
  onNextSubtitle,
  onNextIssue,
  className = ''
}) {
  return (
    <div className={`of-waveform-toolbar ${className}`}>
      {/* Left controls */}
      <div className="of-waveform-controls">
        {/* Collapse toggle */}
        <IconButton
          icon={collapsed ? ChevronRight : ChevronDown}
          size={12}
          title={collapsed ? "Expand waveform" : "Collapse waveform"}
          onClick={onToggleCollapse}
        />
        
        {/* Scroll mode toggle */}
        <div className="of-scroll-mode-toggle">
          <button
            className={`of-scroll-mode-btn ${scrollMode === 'CENTER' ? 'active' : ''}`}
            title="Center playhead mode"
            onClick={() => onScrollModeChange?.('CENTER')}
          >
            <AlignJustify size={10} className="rotate-90" />
          </button>
          <button
            className={`of-scroll-mode-btn ${scrollMode === 'FREE' ? 'active' : ''}`}
            title="Free scroll mode"
            onClick={() => onScrollModeChange?.('FREE')}
          >
            <ArrowRight size={10} />
          </button>
        </div>
        
        {/* Separator */}
        <div className="h-3 w-px bg-slate-800" />
        
        {/* Dialogue isolation */}
        <ToggleButton
          active={isolateDialogue}
          title="Isolate dialogue"
          onClick={onToggleDialogueIsolation}
        >
          DIA
        </ToggleButton>
        
        {/* Spectrogram mode */}
        <IconButton
          icon={Activity}
          size={12}
          active={spectrogramMode}
          title="Toggle spectrogram"
          onClick={onToggleSpectrogramMode}
        />
        
        {/* Separator */}
        <div className="h-3 w-px bg-slate-800" />
        
        {/* Issue filters */}
        <div className="flex items-center gap-1">
          <IconButton
            icon={AlertCircle}
            size={12}
            active={issueFilters.error}
            title="Show errors"
            onClick={() => onToggleIssueFilter?.('error')}
            className={issueFilters.error ? 'text-red-500' : 'text-slate-600'}
          />
          <IconButton
            icon={AlertTriangle}
            size={12}
            active={issueFilters.warning}
            title="Show warnings"
            onClick={() => onToggleIssueFilter?.('warning')}
            className={issueFilters.warning ? 'text-amber-500' : 'text-slate-600'}
          />
          <IconButton
            icon={Info}
            size={12}
            active={issueFilters.info}
            title="Show info"
            onClick={() => onToggleIssueFilter?.('info')}
            className={issueFilters.info ? 'text-cyan-500' : 'text-slate-600'}
          />
        </div>
      </div>
      
      {/* Right controls: Navigation + Zoom */}
      <div className="flex items-center gap-2">
        {/* Navigation buttons */}
        <button
          onClick={onNextSubtitle}
          className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-300 rounded hover:bg-slate-700 transition-colors"
          title="Jump to next subtitle"
        >
          Next Sub
        </button>
        
        <button
          onClick={onNextIssue}
          className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider bg-red-900/30 border border-red-700/50 text-red-400 rounded hover:bg-red-900/50 transition-colors"
          title="Jump to next issue"
        >
          Next Issue
        </button>
        
        {/* Separator */}
        <div className="h-3 w-px bg-slate-800" />
        
        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <IconButton
            icon={ZoomOut}
            size={12}
            title="Zoom out"
            onClick={onZoomOut}
            disabled={zoomLevel <= 0.5}
          />
          <span className="text-[9px] font-mono text-slate-500 w-8 text-center">
            {zoomLevel.toFixed(1)}x
          </span>
          <IconButton
            icon={ZoomIn}
            size={12}
            title="Zoom in"
            onClick={onZoomIn}
            disabled={zoomLevel >= 4}
          />
        </div>
      </div>
    </div>
  );
}

export default WaveformControls;
