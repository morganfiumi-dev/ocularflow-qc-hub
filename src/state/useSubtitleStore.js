/**
 * Subtitle Store for OcularFlow v10.5
 * Manages subtitle data, selection, and editing state
 */

import { create } from 'zustand';
import { generateMockSubtitles, calculateCPS, calculateCPL } from '../utils/subtitleParser';
import { generateMockIssues, buildReviewQueue } from '../utils/issueDetection';

/**
 * Subtitle store using Zustand
 */
const useSubtitleStore = create((set, get) => ({
  // State
  subtitles: [],
  currentIndex: 1,
  filter: 'ALL', // ALL, ERRORS, WARNINGS, CLEAN
  loading: true,
  error: null,
  
  // Actions
  loadSubtitles: () => {
    set({ loading: true });
    
    // Simulate API delay
    setTimeout(() => {
      const mockSubs = generateMockSubtitles(50);
      const subsWithIssues = generateMockIssues(mockSubs);
      
      set({
        subtitles: subsWithIssues,
        currentIndex: 1,
        filter: 'ALL',
        loading: false,
        error: null
      });
    }, 800);
  },
  
  // Select subtitle by index
  selectSubtitle: (index) => {
    set({ currentIndex: index });
  },
  
  // Select next subtitle
  selectNext: () => {
    const { subtitles, currentIndex } = get();
    const maxIndex = subtitles.length;
    const nextIndex = Math.min(maxIndex, currentIndex + 1);
    set({ currentIndex: nextIndex });
  },
  
  // Select previous subtitle
  selectPrevious: () => {
    const { currentIndex } = get();
    const prevIndex = Math.max(1, currentIndex - 1);
    set({ currentIndex: prevIndex });
  },
  
  // Update subtitle text
  updateText: (index, text) => {
    set((state) => ({
      subtitles: state.subtitles.map(sub => {
        if (sub.index !== index) return sub;
        
        const cps = calculateCPS(text, sub.duration);
        const cpl = calculateCPL(text);
        
        return { ...sub, text, cps, cpl };
      })
    }));
  },
  
  // Set filter
  setFilter: (filter) => {
    set({ filter });
  },
  
  // Computed values (getters)
  getCurrentSubtitle: () => {
    const { subtitles, currentIndex } = get();
    return subtitles.find(s => s.index === currentIndex) || null;
  },
  
  getFilteredSubtitles: () => {
    const { subtitles, filter } = get();
    switch (filter) {
      case 'ERRORS':
        return subtitles.filter(s => s.issues.some(i => i.severity === 'error'));
      case 'WARNINGS':
        return subtitles.filter(s => 
          s.issues.some(i => i.severity === 'warning') && 
          !s.issues.some(i => i.severity === 'error')
        );
      case 'CLEAN':
        return subtitles.filter(s => s.issues.length === 0);
      default:
        return subtitles;
    }
  },
  
  getReviewQueue: () => {
    const { subtitles } = get();
    return buildReviewQueue(subtitles, 90);
  },
  
  getStats: () => {
    const { subtitles } = get();
    const total = subtitles.length;
    const withErrors = subtitles.filter(s => s.issues.some(i => i.severity === 'error')).length;
    const withWarnings = subtitles.filter(s => 
      s.issues.some(i => i.severity === 'warning') && 
      !s.issues.some(i => i.severity === 'error')
    ).length;
    const clean = subtitles.filter(s => s.issues.length === 0).length;
    
    return { total, withErrors, withWarnings, clean };
  }
}));

export default useSubtitleStore;
export { useSubtitleStore };
