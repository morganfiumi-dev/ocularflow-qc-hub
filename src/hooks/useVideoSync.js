/**
 * Video Sync Hook for OcularFlow v10.5
 * Synchronizes video playback with subtitle selection
 */

import React, { useEffect, useCallback, useRef } from 'react';

/**
 * Video sync hook
 * @param {Object} options - Sync options
 * @returns {Object} Sync utilities
 */
export function useVideoSync(options = {}) {
  const {
    currentTime = 0,
    subtitles = [],
    currentIndex = 1,
    autoScroll = true,
    onSubtitleChange = null,
    onSeek = null
  } = options;
  
  const lastAutoSelectRef = useRef(null);
  const isUserSelectRef = useRef(false);
  
  // Find subtitle at current time
  const findSubtitleAtTime = useCallback((time) => {
    return subtitles.find(sub => 
      time >= sub.startTime && time < sub.endTime
    );
  }, [subtitles]);
  
  // Find nearest subtitle to time
  const findNearestSubtitle = useCallback((time) => {
    if (subtitles.length === 0) return null;
    
    let nearest = subtitles[0];
    let minDist = Math.abs(time - subtitles[0].startTime);
    
    for (const sub of subtitles) {
      const dist = Math.abs(time - sub.startTime);
      if (dist < minDist) {
        minDist = dist;
        nearest = sub;
      }
    }
    
    return nearest;
  }, [subtitles]);
  
  // Auto-select subtitle based on playback time
  useEffect(() => {
    if (isUserSelectRef.current) {
      isUserSelectRef.current = false;
      return;
    }
    
    const activeSubtitle = findSubtitleAtTime(currentTime);
    
    if (activeSubtitle && activeSubtitle.index !== lastAutoSelectRef.current) {
      lastAutoSelectRef.current = activeSubtitle.index;
      if (onSubtitleChange && autoScroll) {
        onSubtitleChange(activeSubtitle.index);
      }
    }
  }, [currentTime, findSubtitleAtTime, onSubtitleChange, autoScroll]);
  
  // Seek to subtitle
  const seekToSubtitle = useCallback((subtitle) => {
    if (!subtitle || !onSeek) return;
    
    isUserSelectRef.current = true;
    lastAutoSelectRef.current = subtitle.index;
    onSeek(subtitle.startTime);
  }, [onSeek]);
  
  // Seek to subtitle by index
  const seekToIndex = useCallback((index) => {
    const subtitle = subtitles.find(s => s.index === index);
    if (subtitle) {
      seekToSubtitle(subtitle);
    }
  }, [subtitles, seekToSubtitle]);
  
  // Go to next subtitle
  const goToNext = useCallback(() => {
    const nextIndex = Math.min(subtitles.length, currentIndex + 1);
    seekToIndex(nextIndex);
    return nextIndex;
  }, [subtitles.length, currentIndex, seekToIndex]);
  
  // Go to previous subtitle
  const goToPrevious = useCallback(() => {
    const prevIndex = Math.max(1, currentIndex - 1);
    seekToIndex(prevIndex);
    return prevIndex;
  }, [currentIndex, seekToIndex]);
  
  // Check if time is within subtitle bounds
  const isWithinSubtitle = useCallback((subtitle) => {
    if (!subtitle) return false;
    return currentTime >= subtitle.startTime && currentTime < subtitle.endTime;
  }, [currentTime]);
  
  // Get playback progress within current subtitle
  const getSubtitleProgress = useCallback((subtitle) => {
    if (!subtitle || !isWithinSubtitle(subtitle)) return 0;
    
    const elapsed = currentTime - subtitle.startTime;
    const duration = subtitle.endTime - subtitle.startTime;
    
    return Math.min(1, Math.max(0, elapsed / duration));
  }, [currentTime, isWithinSubtitle]);
  
  // Mark user selection (prevents auto-scroll override)
  const markUserSelect = useCallback(() => {
    isUserSelectRef.current = true;
  }, []);
  
  return {
    // State
    activeSubtitle: findSubtitleAtTime(currentTime),
    nearestSubtitle: findNearestSubtitle(currentTime),
    
    // Actions
    seekToSubtitle,
    seekToIndex,
    goToNext,
    goToPrevious,
    markUserSelect,
    
    // Utilities
    findSubtitleAtTime,
    findNearestSubtitle,
    isWithinSubtitle,
    getSubtitleProgress
  };
}

export default useVideoSync;
