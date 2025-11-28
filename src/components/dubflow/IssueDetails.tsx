/**
 * IssueDetails Component for DubFlow
 * Detailed view of selected audio QC issue
 */

import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface Issue {
  id: number;
  time: string;
  timeSeconds: number;
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  suggestedFix: string;
}

interface IssueDetailsProps {
  issue: Issue | null;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function IssueDetails({ issue, notes, onNotesChange }: IssueDetailsProps) {
  if (!issue) {
    return (
      <div className="p-4 text-center text-slate-500 text-xs">
        Select an issue to view details
      </div>
    );
  }

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

  const config = getSeverityConfig(issue.severity);
  const SeverityIcon = config.icon;

  return (
    <div className="p-4 space-y-4">
      {/* Issue type and severity */}
      <div>
        <h4 className="text-sm font-semibold text-slate-100 mb-2">{issue.type}</h4>
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold uppercase border ${config.bg} ${config.color} ${config.border}`}>
          <SeverityIcon className="w-3 h-3" />
          {issue.severity}
        </div>
      </div>

      {/* Timecode */}
      <div className="text-xs space-y-1">
        <span className="text-slate-500 uppercase tracking-wide">Timecode</span>
        <div className="font-mono text-cyan-400">{issue.time}</div>
      </div>

      {/* Description */}
      <div className="text-xs space-y-1">
        <span className="text-slate-500 uppercase tracking-wide">Description</span>
        <p className="text-slate-300 leading-relaxed">{issue.description}</p>
      </div>

      {/* Suggested fix */}
      <div className="text-xs space-y-1">
        <span className="text-slate-500 uppercase tracking-wide">Suggested Fix</span>
        <p className="text-emerald-400 leading-relaxed">{issue.suggestedFix}</p>
      </div>

      {/* Notes field */}
      <div className="text-xs space-y-1">
        <label className="text-slate-500 uppercase tracking-wide block">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add your notes here..."
          className="w-full h-24 px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-slate-100 text-xs resize-none focus:outline-none focus:border-cyan-500/50 transition-colors"
        />
      </div>
    </div>
  );
}
