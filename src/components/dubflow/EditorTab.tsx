/**
 * EditorTab - Full dialogue editor inside inspector
 * Shows all dialogue lines with edit capabilities
 */

import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface DialogueLine {
  id: number;
  timeIn: string;
  timeInSeconds: number;
  timeOutSeconds: number;
  enText: string;
  dubText: string;
  issues: Array<{
    id: number;
    severity: 'error' | 'warning' | 'info';
  }>;
  score?: number;
}

interface EditorTabProps {
  lines: DialogueLine[];
  selectedLineId: number | null;
  currentTime: number;
  onSelectLine: (id: number) => void;
  onLineUpdate?: (id: number, dubText: string) => void;
}

export function EditorTab({
  lines,
  selectedLineId,
  currentTime,
  onSelectLine,
  onLineUpdate,
}: EditorTabProps) {
  
  const handleTextChange = (id: number, text: string) => {
    if (onLineUpdate) {
      onLineUpdate(id, text);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-10 border-b border-slate-800 flex items-center justify-between px-4 flex-shrink-0">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Dialogue Editor</span>
        <span className="text-[10px] text-slate-500">{lines.length} lines</span>
      </div>

      {/* Lines */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {lines.map(line => {
          const isSelected = line.id === selectedLineId;
          const isActive = currentTime >= line.timeInSeconds && currentTime < line.timeOutSeconds;
          const hasErrors = line.issues.some(i => i.severity === 'error');
          const hasWarnings = line.issues.some(i => i.severity === 'warning');

          return (
            <div
              key={line.id}
              onClick={() => onSelectLine(line.id)}
              className={`
                p-3 rounded border cursor-pointer transition-all
                ${isSelected 
                  ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md' 
                  : isActive
                  ? 'bg-slate-800/60 border-slate-700'
                  : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/40'
                }
              `}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-500 font-mono">{line.timeIn}</span>
                
                {/* Issue indicators */}
                <div className="flex items-center gap-1">
                  {hasErrors && <AlertCircle className="w-3 h-3 text-red-400" />}
                  {hasWarnings && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                  {line.score !== undefined && (
                    <span className={`
                      px-1.5 py-0.5 rounded text-[9px] font-bold
                      ${line.score >= 90 
                        ? 'bg-green-500/20 text-green-400' 
                        : line.score >= 70 
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                      }
                    `}>
                      {line.score.toFixed(0)}
                    </span>
                  )}
                </div>
              </div>

              {/* EN text (read-only) */}
              <div className="mb-2">
                <div className="text-[9px] text-slate-600 uppercase tracking-wider mb-0.5">Original (EN)</div>
                <div className="text-xs text-slate-400 bg-slate-900/40 rounded p-2 border border-slate-800/50">
                  {line.enText}
                </div>
              </div>

              {/* Dub text (editable) */}
              <div>
                <div className="text-[9px] text-slate-600 uppercase tracking-wider mb-0.5">Dubbed</div>
                <textarea
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200 font-mono resize-none focus:outline-none focus:border-cyan-500 transition-colors"
                  rows={2}
                  value={line.dubText}
                  onChange={(e) => handleTextChange(line.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
