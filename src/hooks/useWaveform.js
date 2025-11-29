/**
 * Waveform Store for OcularFlow v10.5
 * Manages waveform state and calculations
 */

import { create } from 'zustand';
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
 * Waveform store using Zustand
 */
const useWaveform = create((set, get) => ({
  // State
  ...createInitialState(),
  
  // Set height
  setHeight: (height) => {
    set({ height: Math.max(100, Math.min(600, height)) });
  },
  
  // Adjust height by delta
  adjustHeight: (delta) => {
    const { height } = get();
    set({ height: Math.max(100, Math.min(600, height - delta)) });
  },
  
  // Toggle collapsed
  toggleCollapsed: () => {
    set((state) => ({ collapsed: !state.collapsed }));
  },
  
  // Set zoom level
  setZoom: (level) => {
    set({ zoomLevel: Math.max(0.5, Math.min(4, level)) });
  },
  
  // Zoom in
  zoomIn: () => {
    const { zoomLevel } = get();
    set({ zoomLevel: Math.min(4, zoomLevel + 0.2) });
  },
  
  // Zoom out
  zoomOut: () => {
    const { zoomLevel } = get();
    set({ zoomLevel: Math.max(0.5, zoomLevel - 0.2) });
  },
  
  // Set scroll mode
  setScrollMode: (mode) => {
    set({ scrollMode: mode });
  },
  
  // Toggle dialogue isolation
  toggleDialogueIsolation: () => {
    set((state) => ({ isolateDialogue: !state.isolateDialogue }));
  },
  
  // Toggle spectrogram mode
  toggleSpectrogramMode: () => {
    set((state) => ({ spectrogramMode: !state.spectrogramMode }));
  },
  
  // Toggle layer
  toggleLayer: (layer) => {
    const { layers } = get();
    set({
      layers: {
        ...layers,
        [layer]: !layers[layer]
      }
    });
  },
  
  // Toggle issue filter
  toggleIssueFilter: (severity) => {
    const { issueFilters } = get();
    set({
      issueFilters: {
        ...issueFilters,
        [severity]: !issueFilters[severity]
      }
    });
  },
  
  // Computed getters
  getWindowData: (currentTime, duration) => {
    const { zoomLevel, scrollMode } = get();
    if (scrollMode === 'CENTER') {
      return calculateCenterWindow(currentTime, zoomLevel, duration);
    } else {
      return calculateFreeWindow(currentTime, zoomLevel, duration);
    }
  },
  
  getWaveformBars: (windowStart, visibleWindow) => {
    const { isolateDialogue } = get();
    return generateWaveformBars(windowStart, visibleWindow, 150, isolateDialogue);
  },
  
  handleClick: (clickX, containerWidth, windowStart, visibleWindow) => {
    return clickToTime(clickX, containerWidth, windowStart, visibleWindow);
  },
  
  filterVisibleSubtitles: (subtitles, windowStart, windowEnd) => {
    return getVisibleSubtitles(subtitles, windowStart, windowEnd);
  }
}));

export default useWaveform;
