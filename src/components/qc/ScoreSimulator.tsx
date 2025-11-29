import { useMemo, useState } from 'react';
import { QCLanguageConfig } from '@/state/useQCProfileStore';
import { calculateClipScore, getScoreStatus, QCIssue } from '@/utils/qcScoring';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreSimulatorProps {
  languageConfig: QCLanguageConfig;
  activeClient: string;
}

interface IssueScenario {
  id: string;
  name: string;
  description: string;
  issues: Omit<QCIssue, 'id' | 'time'>[];
}

// Predefined test scenarios
const TEST_SCENARIOS: IssueScenario[] = [
  {
    id: 'perfect',
    name: 'Perfect Clip',
    description: 'No issues detected',
    issues: []
  },
  {
    id: 'minor',
    name: 'Minor Issues',
    description: 'Small quality concerns',
    issues: [
      { categoryId: 'audio_deficiency', checkId: 'levels_too_low', severity: 'WARNING', description: 'Audio level -25 LUFS' },
      { categoryId: 'timing_sync', checkId: 'early_entry', severity: 'WARNING', description: '75ms early' }
    ]
  },
  {
    id: 'moderate',
    name: 'Moderate Issues',
    description: 'Multiple quality concerns',
    issues: [
      { categoryId: 'audio_deficiency', checkId: 'clipping', severity: 'ERROR', description: 'Peak at -0.05 dBFS' },
      { categoryId: 'timing_sync', checkId: 'late_entry', severity: 'ERROR', description: '120ms late' },
      { categoryId: 'dialogue_integrity', checkId: 'prosody_issues', severity: 'WARNING', description: 'Unnatural intonation' }
    ]
  },
  {
    id: 'critical',
    name: 'Critical Issues',
    description: 'Severe quality problems',
    issues: [
      { categoryId: 'channel_integrity', checkId: 'channel_missing_l', severity: 'ERROR', description: 'Left channel silent' },
      { categoryId: 'audio_deficiency', checkId: 'audio_dropout', severity: 'ERROR', description: '500ms dropout at 1:23' },
      { categoryId: 'synthetic_voice', checkId: 'ai_voice_detection', severity: 'ERROR', description: '85% AI confidence' },
      { categoryId: 'dialogue_integrity', checkId: 'missing_words', severity: 'ERROR', description: '3 words missing' }
    ]
  }
];

export function ScoreSimulator({ languageConfig, activeClient }: ScoreSimulatorProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('perfect');

  // Calculate scores for all scenarios
  const scenarioScores = useMemo(() => {
    return TEST_SCENARIOS.map(scenario => {
      const issuesWithIds = scenario.issues.map((issue, idx) => ({
        ...issue,
        id: `${scenario.id}-${idx}`,
        time: 0,
        suggestedFix: ''
      }));
      
      const score = calculateClipScore(issuesWithIds, languageConfig);
      const status = getScoreStatus(score);
      
      // Calculate individual issue penalties
      const penalties = issuesWithIds.map(issue => {
        const category = languageConfig?.checks?.[issue.categoryId];
        if (!category || !category.enabled) return { issue, penalty: 0, breakdown: {} };

        const check = category.checks[issue.checkId];
        if (!check || !check.enabled) return { issue, penalty: 0, breakdown: {} };

        const severityMult = languageConfig.scoring?.severityMultipliers?.[issue.severity] || 1.0;
        const categoryMult = languageConfig.scoring?.categoryMultipliers?.[issue.categoryId] || 1.0;
        const penalty = check.weight * severityMult * categoryMult * check.penalty;

        return {
          issue,
          penalty,
          breakdown: {
            weight: check.weight,
            severityMult,
            categoryMult,
            basePenalty: check.penalty
          }
        };
      });

      return {
        scenario,
        score,
        status,
        penalties
      };
    });
  }, [languageConfig]);

  const currentScenario = scenarioScores.find(s => s.scenario.id === selectedScenario);

  return (
    <div className="h-full flex flex-col bg-[#020617]">
      {/* Header */}
      <div className="h-10 bg-[#0f172a] border-b border-[#334155] flex items-center px-6 shrink-0">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#06b6d4]" />
          <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest">Live Score Preview</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Client Info */}
          <div className="bg-[#0f172a] border border-[#334155]/50 rounded p-3">
            <div className="text-[8px] text-[#64748b] uppercase tracking-wide mb-1">Active Profile</div>
            <div className="text-xs font-bold text-[#f1f5f9]">{activeClient}</div>
          </div>

          {/* Scoring Formula Reference */}
          <div className="bg-[#0f172a] border border-[#334155]/50 rounded p-3 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-3 h-3 text-[#06b6d4]" />
              <div className="text-[8px] text-[#64748b] uppercase tracking-wide font-bold">Formula</div>
            </div>
            <pre className="font-mono text-[10px] text-center text-[#94a3b8]">
              Score = 100 - Σ(W × S × C × P)
            </pre>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[8px] mt-2">
              <div><span className="text-[#06b6d4]">W</span> = Weight (0-1)</div>
              <div><span className="text-[#f59e0b]">S</span> = Severity Mult.</div>
              <div><span className="text-[#8b5cf6]">C</span> = Category Mult.</div>
              <div><span className="text-[#ef4444]">P</span> = Base Penalty</div>
            </div>
          </div>

          {/* Severity Multipliers */}
          {languageConfig?.scoring?.severityMultipliers && (
            <div className="bg-[#0f172a] border border-[#334155]/50 rounded p-3">
              <div className="text-[8px] text-[#64748b] uppercase tracking-wide mb-2">Severity Multipliers</div>
              <div className="space-y-1">
                {Object.entries(languageConfig.scoring.severityMultipliers).map(([severity, mult]) => (
                  <div key={severity} className="flex items-center justify-between text-[10px] font-mono">
                    <span className={cn(
                      severity === 'ERROR' && 'text-[#ef4444]',
                      severity === 'WARNING' && 'text-[#f59e0b]',
                      severity === 'INFO' && 'text-[#06b6d4]'
                    )}>{severity}</span>
                    <span className="text-[#f1f5f9]">×{mult}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Multipliers */}
          {languageConfig?.scoring?.categoryMultipliers && (
            <div className="bg-[#0f172a] border border-[#334155]/50 rounded p-3">
              <div className="text-[8px] text-[#64748b] uppercase tracking-wide mb-2">Category Multipliers</div>
              <div className="space-y-1">
                {Object.entries(languageConfig.scoring.categoryMultipliers).map(([category, mult]) => (
                  <div key={category} className="flex items-center justify-between text-[9px]">
                    <span className="text-[#94a3b8]">{category.replace(/_/g, ' ')}</span>
                    <span className="text-[#f1f5f9] font-mono">×{mult}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Scenarios */}
          <div className="space-y-2">
            <div className="text-[8px] text-[#64748b] uppercase tracking-wide font-bold">Test Scenarios</div>
            {scenarioScores.map(({ scenario, score, status }) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={cn(
                  "w-full text-left p-3 rounded border transition-all",
                  selectedScenario === scenario.id
                    ? "bg-[#06b6d4]/10 border-[#06b6d4]/50"
                    : "bg-[#0f172a] border-[#334155]/50 hover:border-[#334155]"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-[#f1f5f9] mb-0.5">
                      {scenario.name}
                    </div>
                    <div className="text-[8px] text-[#64748b]">
                      {scenario.description}
                    </div>
                    <div className="text-[8px] text-[#94a3b8] mt-1">
                      {scenario.issues.length} {scenario.issues.length === 1 ? 'issue' : 'issues'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={cn(
                      "text-lg font-bold font-mono",
                      status === 'pass' && "text-[#10b981]",
                      status === 'warn' && "text-[#f59e0b]",
                      status === 'fail' && "text-[#ef4444]"
                    )}>
                      {score}
                    </div>
                    <Badge 
                      variant="outline"
                      className={cn(
                        "text-[7px] h-4 px-1.5",
                        status === 'pass' && "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30",
                        status === 'warn' && "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30",
                        status === 'fail' && "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30"
                      )}
                    >
                      {status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Breakdown for Selected Scenario */}
          {currentScenario && currentScenario.scenario.issues.length > 0 && (
            <div className="bg-[#0f172a] border border-[#334155]/50 rounded p-3 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-3 h-3 text-[#ef4444]" />
                <div className="text-[8px] text-[#64748b] uppercase tracking-wide font-bold">
                  Penalty Breakdown
                </div>
              </div>
              
              <div className="space-y-3">
                {currentScenario.penalties.map(({ issue, penalty, breakdown }, idx) => (
                  <div key={idx} className="bg-[#020617]/50 rounded p-2 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-semibold text-[#f1f5f9]">
                          {issue.checkId.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </div>
                        <div className="text-[8px] text-[#64748b] mt-0.5">
                          {issue.description}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-[#ef4444] font-mono">
                          -{penalty.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Formula breakdown */}
                    <div className="flex items-center gap-1 text-[8px] font-mono text-[#94a3b8] flex-wrap">
                      <span className="text-[#06b6d4]">{breakdown.weight}</span>
                      <span>×</span>
                      <span className="text-[#f59e0b]">{breakdown.severityMult}</span>
                      <span>×</span>
                      <span className="text-[#8b5cf6]">{breakdown.categoryMult}</span>
                      <span>×</span>
                      <span className="text-[#ef4444]">{breakdown.basePenalty}</span>
                      <span className="text-[#64748b]">=</span>
                      <span className="text-[#f1f5f9]">{penalty.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="pt-2 border-t border-[#334155]/50 flex items-center justify-between">
                <span className="text-[9px] text-[#64748b] uppercase tracking-wide">Total Deduction</span>
                <span className="text-sm font-bold text-[#ef4444] font-mono">
                  -{(100 - currentScenario.score).toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* Score Thresholds */}
          <div className="bg-[#0f172a] border border-[#334155]/50 rounded p-3">
            <div className="text-[8px] text-[#64748b] uppercase tracking-wide mb-2">Score Thresholds</div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#10b981]">Pass (Excellent)</span>
                <span className="text-[#f1f5f9] font-mono">≥ 90</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#f59e0b]">Review (Acceptable)</span>
                <span className="text-[#f1f5f9] font-mono">70 - 89</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#ef4444]">Fail (Unacceptable)</span>
                <span className="text-[#f1f5f9] font-mono">&lt; 70</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}