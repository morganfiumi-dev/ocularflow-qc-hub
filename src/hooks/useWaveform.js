/**
 * Waveform Hook for OcularFlow v10.5
 * Manages waveform state and calculations
 */

import { useState, useCallback, useMemo } from 'react';
import {
  calculateCenterWindow,
  calculateFreeWindow,
  clickToTime,
  generateWaveformBars,
  getVisibleSubtitles
} from '../utils/waveformProcessing';

/**
 * Initial waveform state
 */
const createInitialState = () => ({
  height: 240,
  collapsed: false,
  zoomLevel: 1,
  scrollMode: 'CENTER', // CENTER or FREE
  isolateDialogue: false,
  spectrogramMode: false,
  issueFilters: {
    error: true,
    warning: true,
    info: true
  },
  layers: {
    scenes: true,
    fn: false,
    songs: false
  }
});

/**
 * Waveform hook
 * @param {number} currentTime - Current playback time
 * @param {number} duration - Total duration
 * @returns {Object} Waveform state and actions
 */
export function useWaveform(currentTime, duration) {
  const [state, setState] = useState(createInitialState);
  
  // Calculate visible window based on scroll mode
  const windowData = useMemo(() => {
    if (state.scrollMode === 'CENTER') {
      return calculateCenterWindow(currentTime, state.zoomLevel, duration);
    } else {
      return calculateFreeWindow(currentTime, state.zoomLevel, duration);
    }
  }, [currentTime, duration, state.zoomLevel, state.scrollMode]);
  
  // Generate waveform bars
  const waveformBars = useMemo(() => {
    return generateWaveformBars(
      windowData.windowStart,
      windowData.visibleWindow,
      150,
      state.isolateDialogue
    );
  }, [windowData.windowStart, windowData.visibleWindow, state.isolateDialogue]);
  
  // Set height
  const setHeight = useCallback((height) => {
    setState(s => ({
      ...s,
      height: Math.max(100, Math.min(600, height))
    }));
  }, []);
  
  // Adjust height by delta
  const adjustHeight = useCallback((delta) => {
    setState(s => ({
      ...s,
      height: Math.max(100, Math.min(600, s.height - delta))
    }));
  }, []);
  
  // Toggle collapsed
  const toggleCollapsed = useCallback(() => {
    setState(s => ({ ...s, collapsed: !s.collapsed }));
  }, []);
  
  // Set zoom level
  const setZoom = useCallback((level) => {
    setState(s => ({
      ...s,
      zoomLevel: Math.max(0.5, Math.min(4, level))
    }));
  }, []);
  
  // Zoom in
  const zoomIn = useCallback(() => {
    setState(s => ({
      ...s,
      zoomLevel: Math.min(4, s.zoomLevel + 0.2)
    }));
  }, []);
  
  // Zoom out
  const zoomOut = useCallback(() => {
    setState(s => ({
      ...s,
      zoomLevel: Math.max(0.5, s.zoomLevel - 0.2)
    }));
  }, []);
  
  // Set scroll mode
  const setScrollMode = useCallback((mode) => {
    setState(s => ({ ...s, scrollMode: mode }));
  }, []);
  
  // Toggle dialogue isolation
  const toggleDialogueIsolation = useCallback(() => {
    setState(s => ({ ...s, isolateDialogue: !s.isolateDialogue }));
  }, []);
  
  // Toggle spectrogram mode
  const toggleSpectrogramMode = useCallback(() => {
    setState(s => ({ ...s, spectrogramMode: !s.spectrogramMode }));
  }, []);
  
  // Toggle layer
  const toggleLayer = useCallback((layer) => {
    setState(s => ({
      ...s,
      layers: {
        ...s.layers,
        [layer]: !s.layers[layer]
      }
    }));
  }, []);
  
  // Toggle issue filter
  const toggleIssueFilter = useCallback((severity) => {
    setState(s => ({
      ...s,
      issueFilters: {
        ...s.issueFilters,
        [severity]: !s.issueFilters[severity]
      }
    }));
  }, []);
  
  // Convert click to time
  const handleClick = useCallback((clickX, containerWidth) => {
    return clickToTime(
      clickX,
      containerWidth,
      windowData.windowStart,
      windowData.visibleWindow
    );
  }, [windowData.windowStart, windowData.visibleWindow]);
  
  // Get visible subtitles
  const filterVisibleSubtitles = useCallback((subtitles) => {
    return getVisibleSubtitles(
      subtitles,
      windowData.windowStart,
      windowData.windowEnd
    );
  }, [windowData.windowStart, windowData.windowEnd]);
  
  return {
    // State
    height: state.height,
    collapsed: state.collapsed,
    zoomLevel: state.zoomLevel,
    scrollMode: state.scrollMode,
    isolateDialogue: state.isolateDialogue,
    spectrogramMode: state.spectrogramMode,
    issueFilters: state.issueFilters,
    layers: state.layers,
    
    // Calculated values
    windowStart: windowData.windowStart,
    windowEnd: windowData.windowEnd,
    visibleWindow: windowData.visibleWindow,
    playheadPct: windowData.playheadPct,
    waveformBars,
    
    // Actions
    setHeight,
    adjustHeight,
    toggleCollapsed,
    setZoom,
    zoomIn,
    zoomOut,
    setScrollMode,
    toggleDialogueIsolation,
    toggleSpectrogramMode,
    toggleLayer,
    toggleIssueFilter,
    handleClick,
    filterVisibleSubtitles
  };
}

export default useWaveform;
