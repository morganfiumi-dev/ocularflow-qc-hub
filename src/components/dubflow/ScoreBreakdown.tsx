/**
 * Score Breakdown Component
 * Visual breakdown of QC scoring by category and check
 */

import React from 'react';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { QCIssue } from '@/utils/qcScoring';
import useQCProfileStore from '@/state/useQCProfileStore';

// Check descriptions for user understanding
const CHECK_DESCRIPTIONS: Record<string, string> = {
  // Audio Deficiency
  audio_dropout: 'Complete loss of audio signal',
  clipping: 'Audio peaks exceed 0dB causing distortion',
  distortion: 'Audio signal degradation or artifacts',
  duration_mismatch: 'Audio length differs from expected duration',
  levels_shift: 'Inconsistent volume levels between segments',
  levels_too_low: 'Audio volume below recommended standards',
  phase_cancellation: 'Stereo channels canceling each other out',
  pop: 'Sharp clicking sound in audio',
  hit: 'Sudden impact or thud in audio',
  tick: 'Small clicking artifacts',
  static: 'Background noise or interference',
  production_error: 'Technical error during production',
  invalid_audio_mix: 'Incorrect channel configuration',
  truncated_audio: 'Audio cut off prematurely',
  missing_component: 'Required audio element missing',
  misc_audio_issue: 'Other audio quality issues',
  
  // Channel Integrity
  channel_missing_l: 'Left channel has no audio',
  channel_missing_r: 'Right channel has no audio',
  channel_missing_c: 'Center channel has no audio',
  channel_missing_lfe: 'Low frequency effects channel missing',
  channel_sound_absent: 'Expected audio missing from channel',
  channel_label_incorrect: 'Channel metadata incorrectly labeled',
  audio_video_mismatch_stereo: 'Stereo audio doesn\'t match video',
  audio_video_mismatch_surround: 'Surround audio doesn\'t match video',
  
  // Timing & Sync
  sync_drift: 'Audio gradually goes out of sync with video',
  early_entry: 'Dialogue starts before character speaks',
  late_entry: 'Dialogue starts after character speaks',
  late_cutoff: 'Dialogue ends after character stops speaking',
  pacing_cps: 'Speaking pace too fast (characters per second)',
  
  // Dialogue Integrity
  missing_words: 'Expected words not present in dialogue',
  added_words: 'Extra words not in original script',
  repetition_stutter: 'Unintentional word repetition',
  tone_mismatch: 'Voice tone doesn\'t match scene emotion',
  prosody_issues: 'Unnatural speech rhythm or intonation',
  pitch_gender_mismatch: 'Voice pitch doesn\'t match character',
  pronunciation_incorrect: 'Words pronounced incorrectly',
  
  // Synthetic Voice
  ai_voice_detection: 'Voice identified as AI-generated',
  over_smoothing: 'Overly processed, unnatural smoothness',
  accent_anomalies: 'Inconsistent or unnatural accent',
  synthetic_artifacts: 'Digital artifacts from voice synthesis',
  
  // Translation
  literal_translation: 'Word-for-word translation lacking context',
  wrong_domain_term: 'Incorrect technical or specialized term',
  formality_issues: 'Incorrect level of formality for context',
  incorrect_region_subtag: 'Wrong regional language variant',
  incorrect_language_tag: 'Wrong language code metadata',
  incorrect_translation: 'Translation doesn\'t convey original meaning'
};

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

  const getPenaltyContext = (penalty: number) => {
    if (penalty >= 20) return { text: 'Critical', color: 'text-red-400' };
    if (penalty >= 15) return { text: 'Severe', color: 'text-orange-400' };
    if (penalty >= 10) return { text: 'Major', color: 'text-amber-400' };
    if (penalty >= 5) return { text: 'Minor', color: 'text-yellow-400' };
    return { text: 'Negligible', color: 'text-slate-400' };
  };

  return (
    <div className="space-y-2">
      {/* Overall Score */}
      {clipScore !== undefined && (
        <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Overall Score
            </span>
            <span className={`text-lg font-bold font-mono ${getScoreColor(clipScore)}`}>
              {clipScore.toFixed(1)}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 leading-relaxed">
            <div className="flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>
                Starts at 100, penalties deducted per issue. 
                <span className="text-emerald-400"> ≥90 Pass</span>, 
                <span className="text-amber-400"> 70-89 Review</span>, 
                <span className="text-red-400"> &lt;70 Fail</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="space-y-1">
        {categoryScores.map(cat => {
          const isExpanded = expandedCategories.has(cat.categoryId);
          const categoryScore = 100 - cat.penalty;
          const categoryMult = langConfig.scoring?.categoryMultipliers?.[cat.categoryId] || 1.0;
          const isHighPriority = categoryMult > 1.0;

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
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">
                        {cat.categoryName}
                      </span>
                      {isHighPriority && (
                        <span className="text-[8px] px-1 py-0.5 bg-cyan-500/20 text-cyan-400 rounded font-bold uppercase">
                          Priority ×{categoryMult.toFixed(1)}
                        </span>
                      )}
                      {cat.issueCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded font-mono">
                          {cat.issueCount}
                        </span>
                      )}
                    </div>
                  </div>
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
                    const basePenalty = check?.penalty || 0;
                    const penaltyContext = getPenaltyContext(basePenalty);
                    const description = CHECK_DESCRIPTIONS[issue.checkId] || issue.description;

                    return (
                      <div key={idx} className="p-2.5 border-b border-slate-800/50 last:border-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs text-slate-300 font-medium">
                                {issue.checkId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                              </span>
                              <span className={`text-[9px] font-bold uppercase px-1 py-0.5 bg-slate-900 rounded ${getSeverityColor(issue.severity)}`}>
                                {issue.severity}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 leading-snug mb-1">
                              {description}
                            </div>
                            <div className="flex items-center gap-2 text-[9px]">
                              <span className="text-slate-600 font-mono">
                                {Math.floor(issue.time / 60)}:{String(Math.floor(issue.time % 60)).padStart(2, '0')}
                              </span>
                              <span className={`${penaltyContext.color}`}>
                                • {penaltyContext.text} ({basePenalty}pt base)
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end flex-shrink-0">
                            <span className="text-[10px] font-mono text-red-400 font-bold">
                              -{penalty.toFixed(1)}
                            </span>
                            <span className="text-[8px] text-slate-600">
                              ×{severityMult.toFixed(1)}×{categoryMult.toFixed(1)}
                            </span>
                          </div>
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
