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
  ZoomIn
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
  onToggleCollapse,
  onScrollModeChange,
  onZoomIn,
  onZoomOut,
  onToggleDialogueIsolation,
  onToggleSpectrogramMode,
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
      </div>
      
      {/* Right controls: Zoom */}
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
  );
}

export default WaveformControls;
