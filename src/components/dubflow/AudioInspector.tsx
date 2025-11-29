/**
 * AudioInspector Component for DubFlow
 * QC Inspector with collapsible issue categories
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface Issue {
  id: number;
  timecode: string;
  timeSeconds: number;
  type: string;
  severity: 'error' | 'warning' | 'info';
  description: string;
  category: string;
}

interface AudioInspectorProps {
  issues: Issue[];
  selectedIssueId: number | null;
  onSelectIssue: (id: number) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

const CATEGORIES = [
  { id: 'technical', label: 'Technical Audio', color: 'red' },
  { id: 'timing', label: 'Timing & Sync', color: 'amber' },
  { id: 'dialogue', label: 'Dialogue Integrity', color: 'blue' },
  { id: 'speaker', label: 'Speaker Checks', color: 'purple' },
  { id: 'synthetic', label: 'Synthetic Voice', color: 'cyan' },
  { id: 'translation', label: 'Translation', color: 'slate' }
];

export function AudioInspector({
  issues,
  selectedIssueId,
  onSelectIssue,
  notes,
  onNotesChange
}: AudioInspectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'technical',
    'timing',
    'dialogue'
  ]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategoryIssues = (categoryId: string) => {
    return issues.filter(issue => issue.category === categoryId);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-3 h-3" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Info className="w-3 h-3" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'text-red-400 bg-red-500/10';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10';
      default:
        return 'text-blue-400 bg-blue-500/10';
    }
  };

  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      red: 'border-red-500/30 bg-red-500/5',
      amber: 'border-amber-500/30 bg-amber-500/5',
      blue: 'border-blue-500/30 bg-blue-500/5',
      purple: 'border-purple-500/30 bg-purple-500/5',
      cyan: 'border-cyan-500/30 bg-cyan-500/5',
      slate: 'border-slate-500/30 bg-slate-500/5'
    };
    return colors[color] || colors.slate;
  };

  const selectedIssue = issues.find(i => i.id === selectedIssueId);

  return (
    <div className="h-full flex flex-col bg-slate-900/60 border border-slate-800 rounded-lg shadow-lg shadow-black/40 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          QC Inspector
        </h3>
        <p className="text-[10px] text-slate-600 mt-1">
          {issues.length} issue{issues.length !== 1 ? 's' : ''} detected
        </p>
      </div>

      {/* Issue Categories */}
      <div className="flex-1 overflow-y-auto">
        {CATEGORIES.map((category) => {
          const categoryIssues = getCategoryIssues(category.id);
          const isExpanded = expandedCategories.includes(category.id);
          const hasIssues = categoryIssues.length > 0;

          return (
            <div key={category.id} className="border-b border-slate-800/50">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={`
                  w-full px-4 py-2.5 flex items-center justify-between
                  hover:bg-slate-800/30 transition-colors
                  ${hasIssues ? getCategoryColor(category.color) : 'bg-slate-900/30'}
                  border-l-2 ${hasIssues ? '' : 'border-l-transparent'}
                `}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {category.label}
                  </span>
                </div>
                {hasIssues && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {categoryIssues.length}
                  </span>
                )}
              </button>

              {/* Category Issues */}
              {isExpanded && hasIssues && (
                <div className="bg-slate-950/40">
                  {categoryIssues.map((issue) => {
                    const isSelected = issue.id === selectedIssueId;
                    return (
                      <div
                        key={issue.id}
                        onClick={() => onSelectIssue(issue.id)}
                        className={`
                          px-4 py-2.5 border-l-2 cursor-pointer transition-all
                          ${isSelected
                            ? 'bg-cyan-500/10 border-l-cyan-500'
                            : 'border-l-transparent hover:bg-slate-800/30'
                          }
                        `}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`mt-0.5 p-1 rounded ${getSeverityColor(issue.severity)}`}>
                            {getSeverityIcon(issue.severity)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-slate-200">
                                {issue.type}
                              </span>
                              <span className="text-[10px] font-mono text-slate-600">
                                {issue.timecode}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {issue.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {isExpanded && !hasIssues && (
                <div className="px-4 py-3 text-center">
                  <p className="text-[10px] text-slate-600">No issues in this category</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Issue Details (when selected) */}
      {selectedIssue && (
        <div className="border-t-2 border-cyan-500/30 bg-slate-950/60 px-4 py-3 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded ${getSeverityColor(selectedIssue.severity)}`}>
                {getSeverityIcon(selectedIssue.severity)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">
                  {selectedIssue.type}
                </h4>
                <p className="text-[10px] font-mono text-slate-600">
                  {selectedIssue.timecode}
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectIssue(selectedIssue.id)}
              className="px-2 py-1 text-[10px] font-semibold uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded hover:bg-cyan-500/30 transition-colors"
            >
              Jump
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedIssue.description}
          </p>
        </div>
      )}

      {/* Notes Section */}
      <div className="border-t border-slate-800 p-4 bg-slate-950/40">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
          Session Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add notes about this QC session..."
          className="w-full h-24 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none"
        />
      </div>
    </div>
  );
}
