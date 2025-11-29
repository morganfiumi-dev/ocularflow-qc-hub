import { QCLanguageConfig, QCCheck } from '@/state/useQCProfileStore';

export interface QCIssue {
  id: string;
  categoryId: string;
  checkId: string;
  time: number;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  description: string;
  suggestedFix?: string;
}

/**
 * Calculate quality score for a clip based on detected issues
 * Formula: clipScore = 100 - Σ(weight × severityMultiplier × categoryMultiplier × penalty)
 */
export function calculateClipScore(
  issues: QCIssue[],
  languageConfig: QCLanguageConfig
): number {
  if (!languageConfig || !languageConfig.scoring) {
    return 100;
  }

  const { severityMultipliers, categoryMultipliers } = languageConfig.scoring;

  let totalPenalty = 0;

  issues.forEach((issue) => {
    const category = languageConfig.checks[issue.categoryId];
    if (!category || !category.enabled) return;

    const check = category.checks[issue.checkId] as QCCheck;
    if (!check || !check.enabled) return;

    const severityMult = severityMultipliers?.[issue.severity] || 1.0;
    const categoryMult = categoryMultipliers?.[issue.categoryId] || 1.0;

    const penalty = check.weight * severityMult * categoryMult * check.penalty;
    totalPenalty += penalty;
  });

  const score = Math.max(0, 100 - totalPenalty);
  return Math.round(score * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate asset score as weighted average of clip scores
 */
export function calculateAssetScore(clipScores: number[]): number {
  if (clipScores.length === 0) return 100;

  const sum = clipScores.reduce((acc, score) => acc + score, 0);
  const average = sum / clipScores.length;

  return Math.round(average * 10) / 10;
}

/**
 * Get score status based on threshold
 */
export function getScoreStatus(score: number): 'pass' | 'warn' | 'fail' {
  if (score >= 90) return 'pass';
  if (score >= 70) return 'warn';
  return 'fail';
}

/**
 * Get color class based on score
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-500';
  if (score >= 70) return 'text-amber-500';
  return 'text-red-500';
}