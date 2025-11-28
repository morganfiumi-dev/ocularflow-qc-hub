/**
 * Issue Store for OcularFlow v10.5
 * Manages inspector panel state and issue interactions
 */

import { useState, useCallback } from 'react';

/**
 * Initial issue/inspector state
 */
const createInitialState = () => ({
  activeTab: 'ANALYSIS', // ANALYSIS, QUEUE, KNP
  expandedIssueId: null,
  showScoreBreakdown: false,
  showAnnotations: {
    source: false,
    target: false
  }
});

/**
 * KNP (Key Names & Places) glossary data
 */
export const KNP_GLOSSARY = [
  { term: "Geralt", type: "Character", tc: "00:01:03:00", subId: 2, seconds: 63 },
  { term: "Rivia", type: "Location", tc: "00:01:08:12", subId: 7, seconds: 68.5 },
  { term: "Yennefer", type: "Character", tc: "00:01:15:00", subId: 10, seconds: 75 },
  { term: "Kaer Morhen", type: "Location", tc: "00:01:22:08", subId: 15, seconds: 82.3 },
  { term: "Nilfgaard", type: "Organization", tc: "00:01:35:16", subId: 20, seconds: 95.7 },
  { term: "Witcher", type: "Term", tc: "00:00:45:00", subId: 1, seconds: 45 },
  { term: "Ciri", type: "Character", tc: "00:02:10:00", subId: 25, seconds: 130 },
  { term: "Jaskier", type: "Character", tc: "00:02:30:12", subId: 30, seconds: 150.5 }
];

/**
 * Issue store hook
 * @returns {Object} Issue store API
 */
export function useIssueStore() {
  const [state, setState] = useState(createInitialState);
  
  // Set active tab
  const setActiveTab = useCallback((tab) => {
    setState(s => ({ ...s, activeTab: tab }));
  }, []);
  
  // Toggle issue expansion
  const toggleIssue = useCallback((issueId) => {
    setState(s => ({
      ...s,
      expandedIssueId: s.expandedIssueId === issueId ? null : issueId
    }));
  }, []);
  
  // Expand issue
  const expandIssue = useCallback((issueId) => {
    setState(s => ({ ...s, expandedIssueId: issueId }));
  }, []);
  
  // Collapse issue
  const collapseIssue = useCallback(() => {
    setState(s => ({ ...s, expandedIssueId: null }));
  }, []);
  
  // Toggle score breakdown
  const toggleScoreBreakdown = useCallback(() => {
    setState(s => ({ ...s, showScoreBreakdown: !s.showScoreBreakdown }));
  }, []);
  
  // Toggle source annotations
  const toggleSourceAnnotations = useCallback(() => {
    setState(s => ({
      ...s,
      showAnnotations: {
        ...s.showAnnotations,
        source: !s.showAnnotations.source
      }
    }));
  }, []);
  
  // Toggle target annotations
  const toggleTargetAnnotations = useCallback(() => {
    setState(s => ({
      ...s,
      showAnnotations: {
        ...s.showAnnotations,
        target: !s.showAnnotations.target
      }
    }));
  }, []);
  
  // Reset state
  const reset = useCallback(() => {
    setState(createInitialState());
  }, []);
  
  return {
    // State
    activeTab: state.activeTab,
    expandedIssueId: state.expandedIssueId,
    showScoreBreakdown: state.showScoreBreakdown,
    showAnnotations: state.showAnnotations,
    knpGlossary: KNP_GLOSSARY,
    
    // Actions
    setActiveTab,
    toggleIssue,
    expandIssue,
    collapseIssue,
    toggleScoreBreakdown,
    toggleSourceAnnotations,
    toggleTargetAnnotations,
    reset
  };
}

export default useIssueStore;
