/**
 * DialogueHighlightStrip - Thin bar showing dialogue lines with issue badges
 * Clicking opens full Dialogue Editor in right inspector
 */

import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface DialogueLine {
  id: number;
  timeIn: string;
  timeInSeconds: number;
  enText: string;
  dubText: string;
  issues: Array<{
    id: number;
    severity: 'error' | 'warning' | 'info';
  }>;
  score?: number;
}

interface DialogueHighlightStripProps {
  lines: DialogueLine[];
  currentTime: number;
  selectedLineId: number | null;
  onSelectLine: (id: number) => void;
}

export function DialogueHighlightStrip({
  lines,
  currentTime,
  selectedLineId,
  onSelectLine,
}: DialogueHighlightStripProps) {
  
  const getSeverityIcon = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-3 h-3" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3" />;
      case 'info':
        return <Info className="w-3 h-3" />;
    }
  };

  const getSeverityColor = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error':
        return 'text-red-400 bg-red-500/10';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10';
      case 'info':
        return 'text-blue-400 bg-blue-500/10';
    }
  };

  return (
    <div className="h-full bg-slate-900/60 border border-slate-800 rounded-md shadow-lg shadow-black/40 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-10 border-b border-slate-800 flex items-center justify-between px-4 flex-shrink-0">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Dialogue</span>
        <span className="text-[10px] text-slate-500">{lines.length} lines</span>
      </div>

      {/* Scrollable lines */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-3">
          {lines.map(line => {
            const isSelected = line.id === selectedLineId;
            const isActive = currentTime >= line.timeInSeconds && currentTime < line.timeInSeconds + 4;
            const errorCount = line.issues.filter(i => i.severity === 'error').length;
            const warningCount = line.issues.filter(i => i.severity === 'warning').length;
            const infoCount = line.issues.filter(i => i.severity === 'info').length;

            return (
              <div
                key={line.id}
                onClick={() => onSelectLine(line.id)}
                className={`
                  relative p-3 rounded border cursor-pointer transition-all
                  ${isSelected 
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md shadow-cyan-500/20' 
                    : isActive
                    ? 'bg-slate-800/60 border-slate-700'
                    : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/40'
                  }
                `}
              >
                {/* Timecode */}
                <div className="text-[10px] text-slate-500 font-mono mb-1">{line.timeIn}</div>

                {/* Text preview */}
                <div className="space-y-1">
                  <div className="text-xs text-slate-400 truncate" title={line.enText}>
                    EN: {line.enText}
                  </div>
                  <div className="text-xs text-slate-300 truncate" title={line.dubText}>
                    DUB: {line.dubText}
                  </div>
                </div>

                {/* Issue badges */}
                {line.issues.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {errorCount > 0 && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded text-red-400 bg-red-500/10 border border-red-500/30">
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-[10px] font-semibold">{errorCount}</span>
                      </div>
                    )}
                    {warningCount > 0 && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded text-amber-400 bg-amber-500/10 border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-[10px] font-semibold">{warningCount}</span>
                      </div>
                    )}
                    {infoCount > 0 && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded text-blue-400 bg-blue-500/10 border border-blue-500/30">
                        <Info className="w-3 h-3" />
                        <span className="text-[10px] font-semibold">{infoCount}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Score badge */}
                {line.score !== undefined && (
                  <div className={`
                    absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold
                    ${line.score >= 90 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : line.score >= 70 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }
                  `}>
                    {line.score.toFixed(0)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}