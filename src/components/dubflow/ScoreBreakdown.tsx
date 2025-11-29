/**
 * Score Breakdown Component
 * Visual breakdown of QC scoring by category and check
 */

import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { QCIssue } from '@/utils/qcScoring';
import useQCProfileStore from '@/state/useQCProfileStore';

interface ScoreBreakdownProps {
  issues: QCIssue[];
  clipScore?: number;
}

export function ScoreBreakdown({ issues, clipScore }: ScoreBreakdownProps) {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());
  const { currentLanguageConfig } = useQCProfileStore();
  const langConfig = currentLanguageConfig();

  if (!langConfig) {
    return (
      <div className="p-3 text-xs text-slate-500 text-center">
        No QC profile loaded
      </div>
    );
  }

  // Group issues by category
  const issuesByCategory = issues.reduce((acc, issue) => {
    if (!acc[issue.categoryId]) {
      acc[issue.categoryId] = [];
    }
    acc[issue.categoryId].push(issue);
    return acc;
  }, {} as Record<string, QCIssue[]>);

  // Calculate penalties per category
  const categoryScores = Object.entries(langConfig.checks).map(([categoryId, category]) => {
    const categoryIssues = issuesByCategory[categoryId] || [];
    let totalPenalty = 0;

    categoryIssues.forEach(issue => {
      const check = category.checks[issue.checkId];
      if (check && check.enabled) {
        const severityMult = langConfig.scoring?.severityMultipliers?.[issue.severity] || 1.0;
        const categoryMult = langConfig.scoring?.categoryMultipliers?.[categoryId] || 1.0;
        const penalty = check.weight * severityMult * categoryMult * check.penalty;
        totalPenalty += penalty;
      }
    });

    return {
      categoryId,
      categoryName: categoryId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      enabled: category.enabled,
      issueCount: categoryIssues.length,
      penalty: totalPenalty,
      issues: categoryIssues
    };
  }).filter(cat => cat.enabled);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'ERROR': return 'text-red-400';
      case 'WARNING': return 'text-amber-400';
      case 'INFO': return 'text-cyan-400';
      default: return 'text-slate-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-2">
      {/* Overall Score */}
      {clipScore !== undefined && (
        <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Overall Score
            </span>
            <span className={`text-lg font-bold font-mono ${getScoreColor(clipScore)}`}>
              {clipScore.toFixed(1)}
            </span>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="space-y-1">
        {categoryScores.map(cat => {
          const isExpanded = expandedCategories.has(cat.categoryId);
          const categoryScore = 100 - cat.penalty;

          return (
            <div key={cat.categoryId} className="bg-slate-900/20 border border-slate-800 rounded-lg overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(cat.categoryId)}
                className="w-full p-2.5 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  )}
                  <span className="text-xs font-semibold text-slate-200">
                    {cat.categoryName}
                  </span>
                  {cat.issueCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded font-mono">
                      {cat.issueCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono">
                    -{cat.penalty.toFixed(1)} pts
                  </span>
                  <span className={`text-sm font-bold font-mono ${getScoreColor(categoryScore)}`}>
                    {categoryScore.toFixed(1)}
                  </span>
                </div>
              </button>

              {/* Expanded Issues */}
              {isExpanded && cat.issues.length > 0 && (
                <div className="border-t border-slate-800 bg-slate-950/40">
                  {cat.issues.map((issue, idx) => {
                    const check = langConfig.checks[issue.categoryId]?.checks[issue.checkId];
                    const severityMult = langConfig.scoring?.severityMultipliers?.[issue.severity] || 1.0;
                    const categoryMult = langConfig.scoring?.categoryMultipliers?.[issue.categoryId] || 1.0;
                    const penalty = check ? check.weight * severityMult * categoryMult * check.penalty : 0;

                    return (
                      <div key={idx} className="p-2.5 border-b border-slate-800/50 last:border-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-slate-300 font-medium">
                                {issue.checkId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                              </span>
                              <span className={`text-[9px] font-bold uppercase px-1 py-0.5 bg-slate-900 rounded ${getSeverityColor(issue.severity)}`}>
                                {issue.severity}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {Math.floor(issue.time / 60)}:{String(Math.floor(issue.time % 60)).padStart(2, '0')}
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-red-400 flex-shrink-0">
                            -{penalty.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Issues */}
      {issues.length === 0 && (
        <div className="p-4 text-center text-xs text-emerald-400/60 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
          Perfect! No issues detected.
        </div>
      )}
    </div>
  );
}
