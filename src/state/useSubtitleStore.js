/**
 * Subtitle Store for OcularFlow v10.5
 * Manages subtitle data, selection, and editing state
 */

import { useState, useCallback, useMemo } from 'react';
import { generateMockSubtitles, calculateCPS, calculateCPL } from '../utils/subtitleParser';
import { generateMockIssues, buildReviewQueue } from '../utils/issueDetection';

/**
 * Initial subtitle state
 */
const createInitialState = () => ({
  subtitles: [],
  currentIndex: 1,
  filter: 'ALL', // ALL, ERRORS, WARNINGS, CLEAN
  loading: true,
  error: null
});

/**
 * Subtitle store hook
 * @returns {Object} Store API
 */
export function useSubtitleStore() {
  const [state, setState] = useState(createInitialState());
  
  // Load mock data
  const loadSubtitles = useCallback(() => {
    setState(s => ({ ...s, loading: true }));
    
    // Simulate API delay
    setTimeout(() => {
      const mockSubs = generateMockSubtitles(50);
      const subsWithIssues = generateMockIssues(mockSubs);
      
      setState({
        subtitles: subsWithIssues,
        currentIndex: 1,
        filter: 'ALL',
        loading: false,
        error: null
      });
    }, 800);
  }, []);
  
  // Select subtitle by index
  const selectSubtitle = useCallback((index) => {
    setState(s => ({ ...s, currentIndex: index }));
  }, []);
  
  // Select next subtitle
  const selectNext = useCallback(() => {
    setState(s => {
      const maxIndex = s.subtitles.length;
      const nextIndex = Math.min(maxIndex, s.currentIndex + 1);
      return { ...s, currentIndex: nextIndex };
    });
  }, []);
  
  // Select previous subtitle
  const selectPrevious = useCallback(() => {
    setState(s => {
      const prevIndex = Math.max(1, s.currentIndex - 1);
      return { ...s, currentIndex: prevIndex };
    });
  }, []);
  
  // Update subtitle text
  const updateText = useCallback((index, text) => {
    setState(s => ({
      ...s,
      subtitles: s.subtitles.map(sub => {
        if (sub.index !== index) return sub;
        
        const cps = calculateCPS(text, sub.duration);
        const cpl = calculateCPL(text);
        
        return { ...sub, text, cps, cpl };
      })
    }));
  }, []);
  
  // Set filter
  const setFilter = useCallback((filter) => {
    setState(s => ({ ...s, filter }));
  }, []);
  
  // Get current subtitle
  const currentSubtitle = useMemo(() => {
    return state.subtitles.find(s => s.index === state.currentIndex) || null;
  }, [state.subtitles, state.currentIndex]);
  
  // Get filtered subtitles
  const filteredSubtitles = useMemo(() => {
    switch (state.filter) {
      case 'ERRORS':
        return state.subtitles.filter(s => s.issues.some(i => i.severity === 'error'));
      case 'WARNINGS':
        return state.subtitles.filter(s => 
          s.issues.some(i => i.severity === 'warning') && 
          !s.issues.some(i => i.severity === 'error')
        );
      case 'CLEAN':
        return state.subtitles.filter(s => s.issues.length === 0);
      default:
        return state.subtitles;
    }
  }, [state.subtitles, state.filter]);
  
  // Get review queue
  const reviewQueue = useMemo(() => {
    return buildReviewQueue(state.subtitles, 90);
  }, [state.subtitles]);
  
  // Get statistics
  const stats = useMemo(() => {
    const total = state.subtitles.length;
    const withErrors = state.subtitles.filter(s => s.issues.some(i => i.severity === 'error')).length;
    const withWarnings = state.subtitles.filter(s => 
      s.issues.some(i => i.severity === 'warning') && 
      !s.issues.some(i => i.severity === 'error')
    ).length;
    const clean = state.subtitles.filter(s => s.issues.length === 0).length;
    
    return { total, withErrors, withWarnings, clean };
  }, [state.subtitles]);
  
  return {
    // State
    subtitles: state.subtitles,
    currentIndex: state.currentIndex,
    currentSubtitle,
    filteredSubtitles,
    reviewQueue,
    filter: state.filter,
    loading: state.loading,
    error: state.error,
    stats,
    
    // Actions
    loadSubtitles,
    selectSubtitle,
    selectNext,
    selectPrevious,
    updateText,
    setFilter
  };
}

export default useSubtitleStore;
