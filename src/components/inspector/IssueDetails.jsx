/**
 * IssueDetails Component for OcularFlow v10.5
 * Detailed view of a QC issue with LLM consensus
 */

import React from 'react';
import { Gavel } from 'lucide-react';

/**
 * IssueDetails component
 * @param {Object} props
 */
export function IssueDetails({
  issue,
  analysisDetails = null,
  className = ''
}) {
  // Calculate consensus metrics if LLM scores exist
  const consensusMetrics = analysisDetails?.llmScores ? calculateConsensus(analysisDetails.llmScores) : null;
  
  return (
    <div className={`of-issue-details of-animate-in ${className}`}>
      {/* Issue description */}
      <div className="of-issue-explanation">
        {analysisDetails?.explanation || issue.description}
      </div>
      
      {/* LLM Consensus (if available) */}
      {analysisDetails?.llmScores && consensusMetrics && (
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase">
            <Gavel size={10} />
            LLM Consensus
          </div>
          
          {/* Tier 1: Consensus Summary */}
          <div className={`
            flex items-center justify-between p-2 rounded border
            ${consensusMetrics.strength === 'unanimous' && consensusMetrics.majorityVote === 'FAIL' 
              ? 'bg-rose-500/10 border-rose-500/30' 
              : consensusMetrics.strength === 'unanimous' && consensusMetrics.majorityVote === 'PASS'
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
            }
          `}>
            <div className="flex items-center gap-2">
              <div className={`
                text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded
                ${consensusMetrics.strength === 'unanimous' && consensusMetrics.majorityVote === 'FAIL'
                  ? 'bg-rose-500/20 text-rose-400'
                  : consensusMetrics.strength === 'unanimous' && consensusMetrics.majorityVote === 'PASS'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
                }
              `}>
                {consensusMetrics.failCount}/{consensusMetrics.total} {consensusMetrics.majorityVote}
              </div>
              <span className="text-[9px] text-slate-400">
                Avg: <span className="font-bold text-slate-300">{consensusMetrics.avgScore}</span>
              </span>
              <span className="text-[9px] text-slate-400">•</span>
              <span className="text-[9px] text-slate-400">
                Confidence: <span className={`font-bold ${
                  consensusMetrics.confidence >= 80 ? 'text-emerald-400' :
                  consensusMetrics.confidence >= 60 ? 'text-cyan-400' :
                  'text-amber-400'
                }`}>{consensusMetrics.confidence}%</span>
              </span>
            </div>
            <div className={`
              text-[8px] font-bold uppercase tracking-wider
              ${consensusMetrics.strength === 'unanimous' ? 'text-cyan-400' : 'text-amber-400'}
            `}>
              {consensusMetrics.strength}
            </div>
          </div>
          
          {/* Tier 2: Vote Groups */}
          <div className="space-y-1.5">
            {consensusMetrics.failCount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-bold text-rose-400 uppercase w-8">FAIL</span>
                <div className="flex flex-wrap gap-1">
                  {consensusMetrics.voteGroups.fail.map((model) => (
                    <div
                      key={model}
                      className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    >
                      {formatModelName(model)}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {consensusMetrics.passCount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-bold text-emerald-400 uppercase w-8">PASS</span>
                <div className="flex flex-wrap gap-1">
                  {consensusMetrics.voteGroups.pass.map((model) => (
                    <div
                      key={model}
                      className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    >
                      {formatModelName(model)} {consensusMetrics.outlier === model && '⚠️'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Tier 3: Individual Algorithm Cards (grouped by vote) */}
          <div className="of-llm-consensus">
            {consensusMetrics.voteGroups.fail.map((model) => {
              const data = analysisDetails.llmScores[model];
              return (
                <LLMVoteCard
                  key={model}
                  model={model}
                  score={data.score}
                  vote={data.vote}
                  note={data.note}
                  isOutlier={false}
                />
              );
            })}
            {consensusMetrics.voteGroups.pass.map((model) => {
              const data = analysisDetails.llmScores[model];
              return (
                <LLMVoteCard
                  key={model}
                  model={model}
                  score={data.score}
                  vote={data.vote}
                  note={data.note}
                  isOutlier={consensusMetrics.outlier === model}
                />
              );
            })}
          </div>
        </div>
      )}
      
      {/* Score impact */}
      {issue.scoreHit && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-500">Score Impact</span>
            <span className="text-rose-400 font-bold">{issue.scoreHit}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Calculate consensus metrics from LLM scores
 */
function calculateConsensus(llmScores) {
  const entries = Object.entries(llmScores);
  const total = entries.length;
  const scores = entries.map(([_, data]) => data.score);
  
  // Count votes
  const failCount = entries.filter(([_, data]) => data.vote === 'FAIL').length;
  const passCount = total - failCount;
  
  // Calculate average score
  const avgScore = Math.round(
    scores.reduce((sum, score) => sum + score, 0) / total
  );
  
  // Calculate variance and confidence
  const variance = scores.reduce((sum, score) => {
    return sum + Math.pow(score - avgScore, 2);
  }, 0) / total;
  const stdDev = Math.sqrt(variance);
  
  // Convert to confidence percentage (lower variance = higher confidence)
  // Max reasonable stdDev is ~30 (scores 0-100), normalize to 0-100%
  const confidence = Math.round(Math.max(0, Math.min(100, 100 - (stdDev * 3.33))));
  
  // Group by vote
  const voteGroups = {
    fail: entries.filter(([_, data]) => data.vote === 'FAIL').map(([model]) => model),
    pass: entries.filter(([_, data]) => data.vote === 'PASS').map(([model]) => model)
  };
  
  // Determine majority and strength
  const majorityVote = failCount > passCount ? 'FAIL' : 'PASS';
  const strength = failCount === total || passCount === total 
    ? 'unanimous' 
    : Math.abs(failCount - passCount) === total 
    ? 'strong' 
    : 'split';
  
  // Find outlier (if exists)
  const outlier = (failCount === 1 ? voteGroups.fail[0] : passCount === 1 ? voteGroups.pass[0] : null);
  
  return {
    total,
    failCount,
    passCount,
    avgScore,
    confidence,
    stdDev: Math.round(stdDev),
    voteGroups,
    majorityVote,
    strength,
    outlier
  };
}

/**
 * Format model name
 */
function formatModelName(model) {
  const names = {
    alg1: 'Alg 1',
    alg2: 'Alg 2',
    alg3: 'Alg 3',
    alg4: 'Alg 4',
    gemini: 'Alg 1',
    gpt4: 'Alg 2',
    claude: 'Alg 3'
  };
  return names[model.toLowerCase()] || model;
}

/**
 * LLM Vote Card
 */
function LLMVoteCard({ model, score, vote, note, isOutlier = false }) {
  const isPass = vote === 'PASS';
  
  return (
    <div className={`of-llm-vote ${isPass ? 'pass' : 'fail'} ${isOutlier ? 'ring-1 ring-amber-500/50' : ''}`}>
      <div className="of-llm-vote-header">
        <span className="of-llm-model">
          {formatModelName(model)}
          {isOutlier && <span className="ml-1 text-amber-400">⚠️</span>}
        </span>
        <span className="of-llm-score">{score}</span>
      </div>
      <p className="of-llm-note">{note}</p>
    </div>
  );
}

export default IssueDetails;
