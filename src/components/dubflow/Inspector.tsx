/**
 * Inspector Component for DubFlow
 * Right panel with issues list and details
 */

import React from 'react';
import { IssueList } from './IssueList';
import { IssueDetails } from './IssueDetails';

interface Issue {
  id: number;
  time: string;
  timeSeconds: number;
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  suggestedFix: string;
}

interface InspectorProps {
  issues: Issue[];
  selectedIssueId: number | null;
  onSelectIssue: (id: number) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function Inspector({
  issues,
  selectedIssueId,
  onSelectIssue,
  notes,
  onNotesChange
}: InspectorProps) {
  const selectedIssue = issues.find(i => i.id === selectedIssueId) || null;

  return (
    <div className="h-full flex flex-col bg-slate-900/60 border border-slate-800 rounded-lg shadow-lg shadow-black/40">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Inspector
        </h3>
      </div>

      {/* Issues List */}
      <div className="border-b border-slate-800">
        <div className="px-4 py-2 bg-slate-900/40">
          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Issues ({issues.length})
          </h4>
        </div>
        <div className="max-h-64 overflow-y-auto">
          <IssueList
            issues={issues}
            selectedIssueId={selectedIssueId}
            onSelectIssue={onSelectIssue}
          />
        </div>
      </div>

      {/* Issue Details */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Details
          </h4>
        </div>
        <IssueDetails
          issue={selectedIssue}
          notes={notes}
          onNotesChange={onNotesChange}
        />
      </div>
    </div>
  );
}
