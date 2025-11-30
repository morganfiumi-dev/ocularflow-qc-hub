/**
 * DubFlow Dialogue Table
 * Bottom section showing all dialogue lines with issues
 */

import React from 'react';
import { Clock, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface DialogueLine {
  id: number;
  timeIn: string;
  timeInSeconds: number;
  timeOutSeconds: number;
  enText: string;
  dubText: string;
  issues: Array<{ severity: 'error' | 'warning' | 'info' }>;
  score?: number;
}

interface DialogueTableProps {
  lines: DialogueLine[];
  selectedLineId: number | null;
  currentTime: number;
  onSelectLine: (id: number) => void;
}

export function DialogueTable({ lines, selectedLineId, currentTime, onSelectLine }: DialogueTableProps) {
  const getActiveLine = () => {
    return lines.find(
      line => currentTime >= line.timeInSeconds && currentTime < line.timeOutSeconds
    );
  };

  const activeLine = getActiveLine();

  return (
    <div className="of-editor-panel border-t border-slate-800">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/40 border-b border-slate-800">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Dialogue Lines
        </h3>
        <div className="text-[9px] text-slate-600">
          {lines.length} lines • {lines.reduce((acc, l) => acc + l.issues.length, 0)} issues
        </div>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: '240px' }}>
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
            <tr>
              <th className="px-2 py-1.5 text-left text-[9px] font-bold text-slate-500 uppercase tracking-wider w-12">#</th>
              <th className="px-2 py-1.5 text-left text-[9px] font-bold text-slate-500 uppercase tracking-wider w-24">Time</th>
              <th className="px-2 py-1.5 text-left text-[9px] font-bold text-slate-500 uppercase tracking-wider">EN Original</th>
              <th className="px-2 py-1.5 text-left text-[9px] font-bold text-slate-500 uppercase tracking-wider">Dub Track</th>
              <th className="px-2 py-1.5 text-center text-[9px] font-bold text-slate-500 uppercase tracking-wider w-20">Issues</th>
              <th className="px-2 py-1.5 text-center text-[9px] font-bold text-slate-500 uppercase tracking-wider w-16">Score</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => {
              const isSelected = line.id === selectedLineId;
              const isActive = activeLine?.id === line.id;
              const errorCount = line.issues.filter(i => i.severity === 'error').length;
              const warningCount = line.issues.filter(i => i.severity === 'warning').length;
              const infoCount = line.issues.filter(i => i.severity === 'info').length;

              return (
                <tr
                  key={line.id}
                  onClick={() => onSelectLine(line.id)}
                  className={`
                    cursor-pointer border-b border-slate-800/40 transition-colors
                    ${isSelected ? 'bg-cyan-500/10 border-cyan-500/30' : 'hover:bg-slate-800/30'}
                    ${isActive ? 'ring-1 ring-cyan-500/30' : ''}
                  `}
                >
                  <td className="px-2 py-2 text-slate-500 font-mono text-[10px]">
                    {line.id}
                  </td>
                  <td className="px-2 py-2 font-mono text-[10px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-600" />
                      {line.timeIn}
                    </div>
                    <div className="text-[9px] text-slate-600 mt-0.5">
                      {(line.timeOutSeconds - line.timeInSeconds).toFixed(1)}s
                    </div>
                  </td>
                  <td className="px-2 py-2 text-slate-300 text-[11px] leading-relaxed">
                    {line.enText}
                  </td>
                  <td className="px-2 py-2 text-slate-200 text-[11px] leading-relaxed">
                    {line.dubText}
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center gap-1">
                      {errorCount > 0 && (
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30">
                          <AlertCircle className="w-3 h-3 text-red-400" />
                          <span className="text-[9px] font-bold text-red-400">{errorCount}</span>
                        </div>
                      )}
                      {warningCount > 0 && (
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span className="text-[9px] font-bold text-amber-400">{warningCount}</span>
                        </div>
                      )}
                      {infoCount > 0 && (
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30">
                          <Info className="w-3 h-3 text-blue-400" />
                          <span className="text-[9px] font-bold text-blue-400">{infoCount}</span>
                        </div>
                      )}
                      {line.issues.length === 0 && (
                        <span className="text-[9px] text-slate-600">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center">
                    {line.score !== undefined ? (
                      <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        line.score >= 90 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : line.score >= 70
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {line.score.toFixed(0)}
                      </div>
                    ) : (
                      <span className="text-[9px] text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
