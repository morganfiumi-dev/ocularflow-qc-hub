/**
 * WaveformPanel Component for OcularFlow v10.5
 * Complete waveform panel with controls and timeline
 */

import React from 'react';
import { WaveformControls } from './WaveformControls';
import { Timeline } from './Timeline';
import { ResizeHandle } from '../atoms/Panel';

/**
 * WaveformPanel component
 * @param {Object} props
 */
export function WaveformPanel({
  // Dimensions
  height = 240,
  collapsed = false,
  
  // Waveform state
  waveformBars = [],
  zoomLevel = 1,
  scrollMode = 'CENTER',
  isolateDialogue = false,
  spectrogramMode = false,
  
  // Timeline state
  subtitles = [],
  currentIndex = 1,
  windowStart = 0,
  visibleWindow = 10,
  playheadPct = 30,
  
  // Callbacks
  onHeightChange,
  onToggleCollapse,
  onZoomIn,
  onZoomOut,
  onScrollModeChange,
  onToggleDialogueIsolation,
  onToggleSpectrogramMode,
  onSeek,
  onSubtitleClick,
  
  className = ''
}) {
  // Handle resize
  const handleResize = (delta) => {
    if (onHeightChange) {
      onHeightChange(-delta); // Negative because dragging up should increase height
    }
  };
  
  return (
    <>
      {/* Resize handle at top */}
      <ResizeHandle
        direction="vertical"
        onDrag={handleResize}
      />
      
      <div
        className={`of-waveform-panel ${collapsed ? 'collapsed' : ''} ${className}`}
        style={{ height: collapsed ? 32 : height }}
      >
        {/* Toolbar */}
        <WaveformControls
          collapsed={collapsed}
          scrollMode={scrollMode}
          zoomLevel={zoomLevel}
          isolateDialogue={isolateDialogue}
          spectrogramMode={spectrogramMode}
          onToggleCollapse={onToggleCollapse}
          onScrollModeChange={onScrollModeChange}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onToggleDialogueIsolation={onToggleDialogueIsolation}
          onToggleSpectrogramMode={onToggleSpectrogramMode}
        />
        
        {/* Timeline (hidden when collapsed) */}
        {!collapsed && (
          <Timeline
            waveformBars={waveformBars}
            subtitles={subtitles}
            currentIndex={currentIndex}
            windowStart={windowStart}
            visibleWindow={visibleWindow}
            playheadPct={playheadPct}
            isolateDialogue={isolateDialogue}
            spectrogramMode={spectrogramMode}
            onSeek={onSeek}
            onSubtitleClick={onSubtitleClick}
          />
        )}
      </div>
    </>
  );
}

export default WaveformPanel;
