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
  return (
    <div className={`of-issue-details of-animate-in ${className}`}>
      {/* Issue description */}
      <div className="of-issue-explanation">
        {analysisDetails?.explanation || issue.description}
      </div>
      
      {/* LLM Consensus (if available) */}
      {analysisDetails?.llmScores && (
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase">
            <Gavel size={10} />
            LLM Consensus
          </div>
          
          <div className="of-llm-consensus">
            {Object.entries(analysisDetails.llmScores).map(([model, data]) => (
              <LLMVoteCard
                key={model}
                model={model}
                score={data.score}
                vote={data.vote}
                note={data.note}
              />
            ))}
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
 * LLM Vote Card
 */
function LLMVoteCard({ model, score, vote, note }) {
  const isPass = vote === 'PASS';
  
  // Format model name
  const formatModel = (m) => {
    const names = {
      alg1: 'Alg 1',
      alg2: 'Alg 2',
      alg3: 'Alg 3',
      alg4: 'Alg 4',
      gemini: 'Alg 1',
      gpt4: 'Alg 2',
      claude: 'Alg 3'
    };
    return names[m.toLowerCase()] || m;
  };
  
  return (
    <div className={`of-llm-vote ${isPass ? 'pass' : 'fail'}`}>
      <div className="of-llm-vote-header">
        <span className="of-llm-model">{formatModel(model)}</span>
        <span className="of-llm-score">{score}</span>
      </div>
      <p className="of-llm-note">{note}</p>
    </div>
  );
}

export default IssueDetails;
