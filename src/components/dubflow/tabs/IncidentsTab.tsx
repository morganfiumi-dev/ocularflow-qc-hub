/**
 * DubFlow Incidents Tab
 * Chronological list of all issues
 */

import React from 'react';
import { AlertCircle, AlertTriangle, Info, Clock } from 'lucide-react';

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
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20';
    }
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
    <div className="space-y-2 p-4">
      <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-3">
        {issues.length} incident{issues.length !== 1 ? 's' : ''} detected
      </div>

      {issues.map((issue, idx) => (
        <div
          key={issue.id}
          onClick={() => onSelectIssue(issue.id)}
          className={`
            p-3 rounded-lg border cursor-pointer transition-all
            ${selectedIssueId === issue.id ? 'ring-2 ring-cyan-500/50' : ''}
            ${getSeverityStyle(issue.severity)}
          `}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getSeverityIcon(issue.severity)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  #{idx + 1}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <Clock className="w-3 h-3" />
                  {issue.timecode}
                </div>
              </div>

              <h4 className="text-xs font-semibold text-slate-200 mb-1">
                {issue.type}
              </h4>

              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
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
          </div>
        </div>
      ))}
    </div>
  );
}
