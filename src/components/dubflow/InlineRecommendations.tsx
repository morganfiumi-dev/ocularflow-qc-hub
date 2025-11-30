/**
 * Inline Recommendations Component
 * Shows quick fix suggestions next to dialogue lines under waveform
 */

import React from 'react';
import { Lightbulb, Clock, Volume2 } from 'lucide-react';

interface DialogueLine {
  id: number;
  timeInSeconds: number;
  timeOutSeconds: number;
  issues: any[];
}

interface InlineRecommendationsProps {
  lines: DialogueLine[];
  windowStart: number;
  visibleWindow: number;
  onApplyFix?: (lineId: number, fixType: string) => void;
}

export function InlineRecommendations({
  lines,
  windowStart,
  visibleWindow,
  onApplyFix
}: InlineRecommendationsProps) {
  const windowEnd = windowStart + visibleWindow;
  
  // Get lines with issues in visible window
  const visibleLinesWithIssues = lines.filter(line => 
    line.issues.length > 0 &&
    line.timeInSeconds < windowEnd &&
    line.timeOutSeconds > windowStart
  );

  if (visibleLinesWithIssues.length === 0) return null;

  const getRecommendation = (issue: any) => {
    const type = issue.type.toLowerCase();
    
    if (type.includes('sync') || type.includes('drift')) {
      return {
        icon: Clock,
        text: 'Shift +50ms',
        action: 'shift_timing',
        color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
      };
    }
    
    if (type.includes('tone') || type.includes('prosody')) {
      return {
        icon: Volume2,
        text: 'Adjust pitch',
        action: 'adjust_prosody',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
      };
    }
    
    return {
      icon: Lightbulb,
      text: 'Review',
      action: 'review',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    };
  };

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ top: '50%' }}>
      {visibleLinesWithIssues.map((line) => {
        const position = ((line.timeInSeconds - windowStart) / visibleWindow) * 100;
        const rec = getRecommendation(line.issues[0]);
        const Icon = rec.icon;
        
        return (
          <div
            key={`rec-${line.id}`}
            className="absolute pointer-events-auto"
            style={{ 
              left: `${Math.max(2, Math.min(85, position))}%`,
              top: '20px'
            }}
          >
            <button
              onClick={() => onApplyFix?.(line.id, rec.action)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-semibold border transition-all hover:scale-105 shadow-lg ${rec.color}`}
              title={`Quick fix for line ${line.id}`}
            >
              <Icon className="w-3 h-3" />
              {rec.text}
            </button>
          </div>
        );
      })}
    </div>
  );
}
