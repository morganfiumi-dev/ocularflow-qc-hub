/**
 * IssueList Component for DubFlow
 * List of audio QC issues
 */

import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface Issue {
  id: number;
  time: string;
  timeSeconds: number;
  type: string;
  severity: 'high' | 'medium' | 'low';
}

interface IssueListProps {
  issues: Issue[];
  selectedIssueId: number | null;
  onSelectIssue: (id: number) => void;
}

export function IssueList({ issues, selectedIssueId, onSelectIssue }: IssueListProps) {
  const getSeverityConfig = (severity: string) => {
    const configs = {
      high: {
        icon: AlertTriangle,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30'
      },
      medium: {
        icon: AlertCircle,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30'
      },
      low: {
        icon: Info,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30'
      }
    };
    return configs[severity as keyof typeof configs] || configs.medium;
  };

  if (issues.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500 text-xs">
        No issues detected
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800">
      {issues.map((issue) => {
        const config = getSeverityConfig(issue.severity);
        const Icon = config.icon;
        const isSelected = issue.id === selectedIssueId;

        return (
          <div
            key={issue.id}
            onClick={() => onSelectIssue(issue.id)}
            className={`p-3 cursor-pointer transition-colors ${
              isSelected
                ? 'bg-slate-800/60'
                : 'hover:bg-slate-800/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 p-1.5 rounded ${config.bg} border ${config.border}`}>
                <Icon className={`w-3 h-3 ${config.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-100">
                    {issue.type}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${config.bg} ${config.color} border ${config.border}`}>
                    {issue.severity}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-500">
                  {issue.time}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
