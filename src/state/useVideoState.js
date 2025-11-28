/**
 * Video State for OcularFlow v10.5
 * Manages video playback, timing, and transport controls
 */

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Initial video state
 */
const createInitialState = () => ({
  isPlaying: false,
  currentTime: 60, // Start at 1 minute for demo
  duration: 300, // 5 minute video
  playbackRate: 1,
  volume: 0.75,
  muted: false
});

/**
 * Video state hook
 * @param {Function} onTimeUpdate - Callback when time updates
 * @returns {Object} Video state API
 */
export function useVideoState(onTimeUpdate = null) {
  const [state, setState] = useState(createInitialState);
  const playbackRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  
  // Playback loop
  useEffect(() => {
    if (state.isPlaying) {
      lastUpdateRef.current = Date.now();
      
      const tick = () => {
        const now = Date.now();
        const delta = (now - lastUpdateRef.current) / 1000;
        lastUpdateRef.current = now;
        
        setState(s => {
          const newTime = s.currentTime + delta * s.playbackRate;
          
          // Loop back or stop at end
          if (newTime >= s.duration) {
            return { ...s, currentTime: 0, isPlaying: false };
          }
          
          return { ...s, currentTime: newTime };
        });
        
        playbackRef.current = requestAnimationFrame(tick);
      };
      
      playbackRef.current = requestAnimationFrame(tick);
    }
    
    return () => {
      if (playbackRef.current) {
        cancelAnimationFrame(playbackRef.current);
        playbackRef.current = null;
      }
    };
  }, [state.isPlaying, state.playbackRate]);
  
  // Notify time updates
  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(state.currentTime);
    }
  }, [state.currentTime, onTimeUpdate]);
  
  // Toggle play/pause
  const togglePlayback = useCallback(() => {
    setState(s => ({ ...s, isPlaying: !s.isPlaying }));
  }, []);
  
  // Play
  const play = useCallback(() => {
    setState(s => ({ ...s, isPlaying: true }));
  }, []);
  
  // Pause
  const pause = useCallback(() => {
    setState(s => ({ ...s, isPlaying: false }));
  }, []);
  
  // Seek to time
  const seek = useCallback((time) => {
    setState(s => ({
      ...s,
      currentTime: Math.max(0, Math.min(s.duration, time))
    }));
  }, []);
  
  // Seek relative (delta in seconds)
  const seekRelative = useCallback((delta) => {
    setState(s => ({
      ...s,
      currentTime: Math.max(0, Math.min(s.duration, s.currentTime + delta))
    }));
  }, []);
  
  // Skip forward (5 seconds)
  const skipForward = useCallback(() => {
    seekRelative(5);
  }, [seekRelative]);
  
  // Skip backward (5 seconds)
  const skipBackward = useCallback(() => {
    seekRelative(-5);
  }, [seekRelative]);
  
  // Frame forward
  const frameForward = useCallback(() => {
    seekRelative(1/24); // 1 frame at 24fps
  }, [seekRelative]);
  
  // Frame backward
  const frameBackward = useCallback(() => {
    seekRelative(-1/24);
  }, [seekRelative]);
  
  // Set playback rate
  const setPlaybackRate = useCallback((rate) => {
    setState(s => ({ ...s, playbackRate: rate }));
  }, []);
  
  // Set volume
  const setVolume = useCallback((volume) => {
    setState(s => ({ ...s, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    setState(s => ({ ...s, muted: !s.muted }));
  }, []);
  
  // Set duration
  const setDuration = useCallback((duration) => {
    setState(s => ({ ...s, duration }));
  }, []);
  
  return {
    // State
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    playbackRate: state.playbackRate,
    volume: state.volume,
    muted: state.muted,
    
    // Actions
    togglePlayback,
    play,
    pause,
    seek,
    seekRelative,
    skipForward,
    skipBackward,
    frameForward,
    frameBackward,
    setPlaybackRate,
    setVolume,
    toggleMute,
    setDuration
  };
}

export default useVideoState;
