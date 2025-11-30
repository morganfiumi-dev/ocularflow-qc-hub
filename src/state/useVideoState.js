/**
 * Video State for OcularFlow v10.5
 * Manages video playback, timing, and transport controls
 */

import React from 'react';
import { create } from 'zustand';

/**
 * Video state using Zustand
 */
const useVideoState = create((set, get) => ({
  // State
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  volume: 0.75,
  muted: false,
  
  // Toggle play/pause
  togglePlayback: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },
  
  // Play
  play: () => {
    set({ isPlaying: true });
  },
  
  // Pause
  pause: () => {
    set({ isPlaying: false });
  },
  
  // Seek to time
  seek: (time) => {
    const { duration } = get();
    set({ currentTime: Math.max(0, Math.min(duration, time)) });
  },
  
  // Seek relative (delta in seconds)
  seekRelative: (delta) => {
    const { currentTime, duration } = get();
    set({ currentTime: Math.max(0, Math.min(duration, currentTime + delta)) });
  },
  
  // Skip forward (5 seconds)
  skipForward: () => {
    get().seekRelative(5);
  },
  
  // Skip backward (5 seconds)
  skipBackward: () => {
    get().seekRelative(-5);
  },
  
  // Frame forward
  frameForward: () => {
    get().seekRelative(1/24); // 1 frame at 24fps
  },
  
  // Frame backward
  frameBackward: () => {
    get().seekRelative(-1/24);
  },
  
  // Set playback rate
  setPlaybackRate: (rate) => {
    set({ playbackRate: rate });
  },
  
  // Set volume
  setVolume: (volume) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },
  
  // Toggle mute
  toggleMute: () => {
    set((state) => ({ muted: !state.muted }));
  },
  
  // Set duration
  setDuration: (duration) => {
    set({ duration });
  }
}));

export default useVideoState;
export { useVideoState };
