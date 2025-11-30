/**
 * DubFlow Visual Tab
 * Shows category-specific visualizations
 */

import React from 'react';
import { BipolarDivergenceGraph } from '../visualizations/BipolarDivergenceGraph';
import { ArtifactHeatmap } from '../visualizations/ArtifactHeatmap';
import { SyncDriftBar } from '../visualizations/SyncDriftBar';
import { ChannelHealthMatrix } from '../visualizations/ChannelHealthMatrix';
import { VisemeConnector } from '../visualizations/VisemeConnector';

interface Issue {
  id: number;
  categoryId: string;
  type: string;
  description: string;
}

interface VisualTabProps {
  selectedIssue: Issue | null;
}

export function VisualTab({ selectedIssue }: VisualTabProps) {
  if (!selectedIssue) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 rounded-full bg-slate-800/60 border border-slate-700 flex items-center justify-center mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Select an Issue</h3>
        <p className="text-xs text-slate-500">
          Choose an incident from the list to view detailed visualizations.
        </p>
      </div>
    );
  }

  const renderVisualization = () => {
    const { categoryId } = selectedIssue;

    // Script Doctor Mode (combined view for dialogue/sync issues)
    if (['timing_sync', 'dialogue_integrity', 'translation'].includes(categoryId)) {
      return (
        <div className="space-y-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Script Doctor Mode Active
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {selectedIssue.description}
            </p>
          </div>
          
          <SyncDriftBar />
          <BipolarDivergenceGraph />
          <VisemeConnector />
        </div>
      );
    }

    // Synthetic voice issues
    if (categoryId === 'synthetic_voice') {
      return (
        <div className="space-y-4">
          <ArtifactHeatmap />
          <BipolarDivergenceGraph />
        </div>
      );
    }

    // Channel integrity issues
    if (categoryId === 'channel_integrity') {
      return (
        <div className="space-y-4">
          <ChannelHealthMatrix />
        </div>
      );
    }

    // Audio deficiency (general)
    return (
      <div className="space-y-4">
        <BipolarDivergenceGraph />
        <ArtifactHeatmap />
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">
          Analyzing Issue
        </div>
        <h3 className="text-sm font-semibold text-slate-200">{selectedIssue.type}</h3>
      </div>

      {renderVisualization()}
    </div>
  );
}
