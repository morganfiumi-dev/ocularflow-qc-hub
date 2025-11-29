/**
 * DialogueEditor Component for DubFlow
 * Two-column dialogue editor matching OcularFlow style
 */

import React from 'react';
import { Badge } from '../atoms/Badge';

interface DialogueLine {
  id: number;
  timeIn: string;
  timeInSeconds: number;
  enText: string;
  dubText: string;
  issues: Array<{ severity: string; type: string }>;
  score?: number; // Add clip score
}

interface DialogueEditorProps {
  lines: DialogueLine[];
  selectedLineId: number | null;
  currentTime: number;
  onSelectLine: (id: number) => void;
}

export function DialogueEditor({
  lines,
  selectedLineId,
  currentTime,
  onSelectLine
}: DialogueEditorProps) {
  const formatTimecode = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = Math.floor((seconds % 1) * 24);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'warning': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      default: return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/60 border border-slate-800 rounded-lg shadow-lg shadow-black/40 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Dialogue Editor
        </h3>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[1fr_1fr_80px] gap-4 px-4 py-2 border-b border-slate-800 bg-slate-950/50">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          EN Source (Reference)
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Dub Transcript
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">
          Score
        </div>
      </div>

      {/* Lines */}
      <div className="flex-1 overflow-y-auto">
        {lines.map((line) => {
          const isSelected = line.id === selectedLineId;
          const isActive = currentTime >= line.timeInSeconds && currentTime < line.timeInSeconds + 3;

          return (
            <div
              key={line.id}
              onClick={() => onSelectLine(line.id)}
              className={`
                grid grid-cols-[1fr_1fr_80px] gap-4 px-4 py-3 border-b border-slate-800/50 cursor-pointer transition-all
                ${isSelected ? 'bg-cyan-500/10 border-l-4 border-l-cyan-500' : 'hover:bg-slate-800/30'}
                ${isActive ? 'ring-1 ring-amber-500/30' : ''}
              `}
            >
              {/* EN Source Column */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500">
                    {line.timeIn}
                  </span>
                  {line.issues.length > 0 && (
                    <div className="flex gap-1">
                      {line.issues.slice(0, 2).map((issue, idx) => (
                        <span
                          key={idx}
                          className={`text-[8px] px-1.5 py-0.5 rounded border ${getSeverityColor(issue.severity)}`}
                        >
                          {issue.type}
                        </span>
                      ))}
                      {line.issues.length > 2 && (
                        <span className="text-[8px] text-slate-500">
                          +{line.issues.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {line.enText}
                </p>
              </div>

              {/* Dub Transcript Column */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-600">
                  #{line.id.toString().padStart(3, '0')}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {line.dubText}
                </p>
              </div>

              {/* Score Column */}
              <div className="flex flex-col items-center justify-center gap-1">
                {line.score !== undefined ? (
                  <>
                    <div className={`text-lg font-bold font-mono ${
                      line.score >= 90 ? 'text-green-400' : 
                      line.score >= 70 ? 'text-amber-400' : 
                      'text-red-400'
                    }`}>
                      {line.score.toFixed(0)}
                    </div>
                    <div className={`text-[7px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      line.score >= 90 ? 'bg-green-500/20 text-green-400' : 
                      line.score >= 70 ? 'bg-amber-500/20 text-amber-400' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {line.score >= 90 ? 'PASS' : line.score >= 70 ? 'OK' : 'FAIL'}
                    </div>
                  </>
                ) : (
                  <span className="text-[10px] text-slate-600">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
