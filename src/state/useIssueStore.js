/**
 * Issue Store for OcularFlow v10.5
 * Manages inspector panel state and issue interactions
 */

import React from 'react';
import { create } from 'zustand';

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
 * Issue store using Zustand
 */
const useIssueStore = create((set, get) => ({
  // State
  activeTab: 'ANALYSIS', // ANALYSIS, QUEUE, KNP
  expandedIssueId: null,
  showScoreBreakdown: false,
  showAnnotations: {
    source: false,
    target: false
  },
  knpGlossary: KNP_GLOSSARY,
  
  // Set active tab
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },
  
  // Toggle issue expansion
  toggleIssue: (issueId) => {
    set((state) => ({
      expandedIssueId: state.expandedIssueId === issueId ? null : issueId
    }));
  },
  
  // Expand issue
  expandIssue: (issueId) => {
    set({ expandedIssueId: issueId });
  },
  
  // Collapse issue
  collapseIssue: () => {
    set({ expandedIssueId: null });
  },
  
  // Toggle score breakdown
  toggleScoreBreakdown: () => {
    set((state) => ({ showScoreBreakdown: !state.showScoreBreakdown }));
  },
  
  // Toggle source annotations
  toggleSourceAnnotations: () => {
    set((state) => ({
      showAnnotations: {
        ...state.showAnnotations,
        source: !state.showAnnotations.source
      }
    }));
  },
  
  // Toggle target annotations
  toggleTargetAnnotations: () => {
    set((state) => ({
      showAnnotations: {
        ...state.showAnnotations,
        target: !state.showAnnotations.target
      }
    }));
  },
  
  // Reset state
  reset: () => {
    set({
      activeTab: 'ANALYSIS',
      expandedIssueId: null,
      showScoreBreakdown: false,
      showAnnotations: {
        source: false,
        target: false
      }
    });
  }
}));

export default useIssueStore;
export { useIssueStore };
