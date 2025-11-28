/**
 * Issue Detection for OcularFlow v10.5
 * Quality control issue detection and scoring
 */

import { calculateCPS, calculateCPL, isCPSExceeded, isCPLExceeded } from './subtitleParser';

/**
 * Issue types and their base penalties
 */
const ISSUE_PENALTIES = {
  semantic: 20,
  contextual: 15,
  technical: 10,
  timing: 8,
  grammar: 5
};

/**
 * Severity multipliers
 */
const SEVERITY_MULTIPLIERS = {
  error: 1.5,
  warning: 1.0,
  info: 0.5
};

/**
 * Detect all issues in a subtitle
 * @param {Object} subtitle 
 * @param {Object} context - Additional context (prev/next subtitles, source, etc.)
 * @returns {Array} Detected issues
 */
export function detectIssues(subtitle, context = {}) {
  const issues = [];
  
  // Technical checks
  issues.push(...detectTechnicalIssues(subtitle));
  
  // Timing checks
  issues.push(...detectTimingIssues(subtitle, context));
  
  // Semantic checks (mock for demo)
  if (context.isSemantic) {
    issues.push({
      id: `iss_${subtitle.index}_sem`,
      ruleName: 'Tone Mismatch',
      severity: 'error',
      type: 'semantic',
      description: 'Formal register used in informal context.',
      scoreHit: -20
    });
  }
  
  // Contextual checks (mock for demo)
  if (context.isContextual) {
    issues.push({
      id: `iss_${subtitle.index}_ctx`,
      ruleName: 'Contextual Error',
      severity: 'warning',
      type: 'contextual',
      description: 'Incorrect domain terminology.',
      scoreHit: -10
    });
  }
  
  return issues;
}

/**
 * Detect technical issues (CPS, CPL, line count)
 * @param {Object} subtitle 
 * @returns {Array}
 */
export function detectTechnicalIssues(subtitle) {
  const issues = [];
  const cps = calculateCPS(subtitle.text, subtitle.duration);
  const cpl = calculateCPL(subtitle.text);
  
  if (isCPSExceeded(cps)) {
    issues.push({
      id: `iss_${subtitle.index}_cps`,
      ruleName: 'Reading Speed',
      severity: 'warning',
      type: 'technical',
      description: `CPS (${cps.toFixed(1)}) exceeds threshold (20).`,
      scoreHit: -8
    });
  }
  
  if (isCPLExceeded(cpl)) {
    issues.push({
      id: `iss_${subtitle.index}_cpl`,
      ruleName: 'Line Length',
      severity: 'warning',
      type: 'technical',
      description: `CPL (${cpl}) exceeds threshold (42).`,
      scoreHit: -5
    });
  }
  
  return issues;
}

/**
 * Detect timing issues
 * @param {Object} subtitle 
 * @param {Object} context 
 * @returns {Array}
 */
export function detectTimingIssues(subtitle, context) {
  const issues = [];
  
  // Minimum duration
  if (subtitle.duration < 0.833) {
    issues.push({
      id: `iss_${subtitle.index}_mindur`,
      ruleName: 'Minimum Duration',
      severity: 'error',
      type: 'timing',
      description: 'Subtitle duration below minimum (0.833s).',
      scoreHit: -10
    });
  }
  
  // Maximum duration
  if (subtitle.duration > 7) {
    issues.push({
      id: `iss_${subtitle.index}_maxdur`,
      ruleName: 'Maximum Duration',
      severity: 'warning',
      type: 'timing',
      description: 'Subtitle duration exceeds maximum (7s).',
      scoreHit: -5
    });
  }
  
  // Gap with previous subtitle
  if (context.prevSubtitle) {
    const gap = subtitle.startTime - context.prevSubtitle.endTime;
    if (gap < 0.083) {
      issues.push({
        id: `iss_${subtitle.index}_gap`,
        ruleName: 'Insufficient Gap',
        severity: 'error',
        type: 'timing',
        description: 'Gap from previous subtitle is less than 2 frames.',
        scoreHit: -15
      });
    }
  }
  
  return issues;
}

/**
 * Calculate quality score from issues
 * @param {Array} issues 
 * @returns {number} Score (0-100)
 */
export function calculateQualityScore(issues) {
  let score = 100;
  
  for (const issue of issues) {
    const basePenalty = ISSUE_PENALTIES[issue.type] || 10;
    const multiplier = SEVERITY_MULTIPLIERS[issue.severity] || 1;
    score -= basePenalty * multiplier;
  }
  
  return Math.max(0, Math.round(score));
}

/**
 * Get score status
 * @param {number} score 
 * @returns {string} 'pass' | 'warn' | 'fail'
 */
export function getScoreStatus(score) {
  if (score >= 90) return 'pass';
  if (score >= 70) return 'warn';
  return 'fail';
}

/**
 * Calculate vector data for radar diagram
 * @param {Array} issues 
 * @returns {Array} [semantic, style, grammar, technical, timing]
 */
export function calculateVectorData(issues) {
  const vectors = {
    semantic: 95,
    style: 90,
    grammar: 95,
    technical: 98,
    timing: 92
  };
  
  for (const issue of issues) {
    const penalty = ISSUE_PENALTIES[issue.type] || 10;
    const multiplier = SEVERITY_MULTIPLIERS[issue.severity] || 1;
    const reduction = penalty * multiplier;
    
    switch (issue.type) {
      case 'semantic':
        vectors.semantic = Math.max(0, vectors.semantic - reduction);
        break;
      case 'contextual':
        vectors.style = Math.max(0, vectors.style - reduction);
        break;
      case 'grammar':
        vectors.grammar = Math.max(0, vectors.grammar - reduction);
        break;
      case 'technical':
        vectors.technical = Math.max(0, vectors.technical - reduction);
        break;
      case 'timing':
        vectors.timing = Math.max(0, vectors.timing - reduction);
        break;
    }
  }
  
  return [vectors.semantic, vectors.style, vectors.grammar, vectors.technical, vectors.timing];
}

/**
 * Generate mock issues for demo subtitles
 * @param {Array} subtitles 
 * @returns {Array} Subtitles with issues
 */
export function generateMockIssues(subtitles) {
  return subtitles.map((sub, i) => {
    const isSemantic = i === 1;
    const isContextual = i === 2;
    const isTiming = i === 7;
    
    const issues = detectIssues(sub, { isSemantic, isContextual });
    const qualityScore = calculateQualityScore(issues);
    const vectorData = calculateVectorData(issues);
    
    let analysisDetails = null;
    if (isSemantic) {
      analysisDetails = {
        explanation: "The formal register 'haciendo banca' does not match the urgency of the action. Consider using 'girando' for aviation context.",
        llmScores: {
          gemini: { score: 35, vote: 'FAIL', note: 'Register mismatch.' },
          gpt4: { score: 42, vote: 'FAIL', note: 'Wrong tone.' },
          claude: { score: 38, vote: 'FAIL', note: 'Formal in informal context.' }
        }
      };
    }
    
    return {
      ...sub,
      issues,
      qualityScore,
      vectorData,
      analysisDetails,
      contextType: isSemantic ? 'FN' : 'DIALOGUE'
    };
  });
}

/**
 * Build review queue from subtitles
 * @param {Array} subtitles 
 * @param {number} threshold 
 * @returns {Array}
 */
export function buildReviewQueue(subtitles, threshold = 90) {
  return subtitles
    .filter(s => s.qualityScore < threshold)
    .flatMap(s => 
      s.issues.map(issue => ({
        ...issue,
        subIndex: s.index,
        score: s.qualityScore
      }))
    )
    .sort((a, b) => {
      const severityOrder = { error: 0, warning: 1, info: 2 };
      const severityDiff = (severityOrder[a.severity] || 0) - (severityOrder[b.severity] || 0);
      if (severityDiff !== 0) return severityDiff;
      return a.score - b.score;
    });
}

export default {
  detectIssues,
  detectTechnicalIssues,
  detectTimingIssues,
  calculateQualityScore,
  getScoreStatus,
  calculateVectorData,
  generateMockIssues,
  buildReviewQueue
};
