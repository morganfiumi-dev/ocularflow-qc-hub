/**
 * DubFlow Incidents Tab - Compact with Expandable Details
 * Shows chronological list with collapsible visualizations
 */

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { BipolarDivergenceGraph } from '../visualizations/BipolarDivergenceGraph';
import { ArtifactHeatmap } from '../visualizations/ArtifactHeatmap';
import { SyncDriftBar } from '../visualizations/SyncDriftBar';
import { ChannelHealthMatrix } from '../visualizations/ChannelHealthMatrix';
import { VisemeConnector } from '../visualizations/VisemeConnector';

interface Issue {
  id: number;
  timecode: string;
  timeSeconds: number;
  type: string;
  severity: 'error' | 'warning' | 'info';
  description: string;
  categoryId: string;
}

interface IncidentsTabProps {
  issues: Issue[];
  selectedIssueId: number | null;
  onSelectIssue: (id: number) => void;
}

export function IncidentsTab({ issues, selectedIssueId, onSelectIssue }: IncidentsTabProps) {
  const [expandedIssueId, setExpandedIssueId] = useState<number | null>(null);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Info className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-500/10 border-red-500/30 hover:bg-red-500/15';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15';
      default:
        return 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/15';
    }
  };

  const getVisualization = (issue: Issue) => {
    const categoryId = issue.categoryId;
    
    // Sync/Timing issues
    if (['timing_sync', 'dialogue_integrity'].includes(categoryId)) {
      return (
        <div className="space-y-3">
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              📊 Prosody Analysis
            </h4>
            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
              This graph compares the emotional tone and pacing between the original source audio and the dub. 
              Large differences indicate the dub doesn't match the original's feel or rhythm.
            </p>
            <BipolarDivergenceGraph eventTime={issue.timeSeconds} />
          </div>
          
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              ⏱️ Sync Timing
            </h4>
            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
              Shows how early or late the dub dialogue is compared to the original. 
              The marker should stay in the green zone for proper synchronization.
            </p>
            <SyncDriftBar />
          </div>

          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              👄 Lip Sync Check
            </h4>
            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
              Compares mouth shapes (visemes) between original and dub. 
              Red connections show phoneme mismatches that may cause visible lip sync issues.
            </p>
            <VisemeConnector />
          </div>
        </div>
      );
    }
    
    // Synthetic voice issues
    if (categoryId === 'synthetic_voice') {
      return (
        <div className="space-y-3">
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              🔥 AI Artifact Detection
            </h4>
            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
              This heatmap highlights regions where AI-generated voice artifacts are detected. 
              <span className="font-semibold text-amber-400"> Orange/yellow areas</span> indicate moderate synthetic patterns, 
              while <span className="font-semibold text-red-400">red hotspots</span> show strong AI signatures that listeners may notice.
            </p>
            <ArtifactHeatmap />
          </div>
        </div>
      );
    }
    
    // Channel integrity issues
    if (categoryId === 'channel_integrity') {
      return (
        <div className="space-y-3">
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              🔊 Channel Health Matrix
            </h4>
            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
              Shows the status of all audio channels (L, C, R, Ls, Rs, LFE). 
              Green = healthy signal, Yellow = weak/concerns, Red = missing or severe issues.
            </p>
            <ChannelHealthMatrix />
          </div>
        </div>
      );
    }

    // Translation issues - show prosody + sync
    if (categoryId === 'translation') {
      return (
        <div className="space-y-3">
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              📝 Translation Impact
            </h4>
            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
              Translation issues can affect timing and tone delivery. Review both graphs to see if the translation 
              caused pacing problems or emotional mismatch.
            </p>
            <BipolarDivergenceGraph eventTime={issue.timeSeconds} />
          </div>
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <SyncDriftBar />
          </div>
        </div>
      );
    }

    // Default - show general visualizations
    return (
      <div className="space-y-3">
        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
          <BipolarDivergenceGraph eventTime={issue.timeSeconds} />
        </div>
      </div>
    );
  };

  const handleToggleExpand = (issueId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIssueId(expandedIssueId === issueId ? null : issueId);
  };

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-300 mb-2">No Issues Detected</h3>
        <p className="text-xs text-slate-500">This audio track passes all QC checks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 p-3">
      <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">
        {issues.length} incident{issues.length !== 1 ? 's' : ''} detected
      </div>

      {issues.map((issue, idx) => {
        const isExpanded = expandedIssueId === issue.id;
        const isSelected = selectedIssueId === issue.id;

        return (
          <div
            key={issue.id}
            className={`
              rounded-lg border transition-all
              ${isSelected ? 'ring-2 ring-cyan-500/50' : ''}
              ${getSeverityStyle(issue.severity)}
            `}
          >
            {/* Compact Header - Always visible */}
            <div
              onClick={() => onSelectIssue(issue.id)}
              className="p-2.5 cursor-pointer"
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  {getSeverityIcon(issue.severity)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400">
                      <Clock className="w-2.5 h-2.5" />
                      {issue.timecode}
                    </div>
                  </div>

                  <h4 className="text-[11px] font-semibold text-slate-200 leading-tight">
                    {issue.type}
                  </h4>

                  {!isExpanded && (
                    <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-1 mt-0.5">
                      {issue.description}
                    </p>
                  )}
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={(e) => handleToggleExpand(issue.id, e)}
                  className="flex-shrink-0 p-1 hover:bg-slate-700/30 rounded transition-colors"
                  aria-label={isExpanded ? "Collapse details" : "Expand details"}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Details - Visualization + Full Description */}
            {isExpanded && (
              <div className="px-2.5 pb-2.5 space-y-2 border-t border-slate-800/50">
                {/* Full Description */}
                <div className="pt-2">
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    {issue.description}
                  </p>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      issue.severity === 'error' ? 'bg-red-500/20 text-red-400' :
                      issue.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {issue.severity}
                    </span>
                    <span className="text-[9px] text-slate-600">
                      {issue.categoryId.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Visualizations */}
                <div className="pt-1">
                  {getVisualization(issue)}
                </div>

                {/* Action Suggestions for Translators */}
                <div className="p-2 bg-cyan-500/5 border border-cyan-500/20 rounded text-[10px] text-slate-400">
                  <span className="font-semibold text-cyan-400">💡 What to do:</span> Review the visualizations above. 
                  Check if retiming or rewording can fix the issue without losing meaning.
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}