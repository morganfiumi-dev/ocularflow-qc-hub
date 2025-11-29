/**
 * ScriptDoctorMode - UI for timing/dialogue/translation issues
 * Shows video crop, phoneme strip, and suggestions
 * UI-only, no logic changes
 */

import React from 'react';
import { PlayCircle, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { Button } from '../atoms/Button';

interface Issue {
  id: number;
  timecode: string;
  timeSeconds: number;
  type: string;
  severity: 'error' | 'warning' | 'info';
  description: string;
  categoryId: string;
  checkId: string;
}

interface DialogueLine {
  id: number;
  timeIn: string;
  timeInSeconds: number;
  enText: string;
  dubText: string;
}

interface ScriptDoctorModeProps {
  issue: Issue;
  dialogueLine?: DialogueLine;
  currentTime: number;
}

export function ScriptDoctorMode({
  issue,
  dialogueLine,
  currentTime,
}: ScriptDoctorModeProps) {
  
  // Mock suggestions (UI-only)
  const suggestions = [
    {
      id: 1,
      type: 'Alternate Phrasing',
      text: 'Try: "El Continente es inmenso, repleto de monstruos y magia."',
      confidence: 0.92,
    },
    {
      id: 2,
      type: 'Timing Adjustment',
      text: 'Shift start time by -0.2s to improve sync',
      confidence: 0.87,
    },
    {
      id: 3,
      type: 'Prosody',
      text: 'Emphasize "vasto" for better emotional match',
      confidence: 0.79,
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-10 border-b border-slate-800 flex items-center justify-between px-4 flex-shrink-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Script Doctor</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">{issue.timecode}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* The Check (Visual) */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">The Check (Visual)</h3>
          
          <div className="bg-slate-950/60 rounded border border-slate-800 p-3 space-y-3">
            {/* Video crop placeholder */}
            <div className="aspect-video bg-slate-900 rounded border border-slate-700 flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-slate-700" />
            </div>

            {/* Phoneme/Viseme strip (UI-only static) */}
            <div className="space-y-2">
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">Phoneme Timeline</div>
              <div className="flex gap-1 h-8 items-end">
                {[40, 65, 80, 55, 70, 85, 60, 75, 50, 45, 70, 80, 55, 65].map((height, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-sm opacity-60"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Lip-sync offset indicator */}
            <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded">
              <span className="text-[10px] text-slate-500">Lip-sync offset:</span>
              <span className="text-xs font-mono text-amber-400">-120ms</span>
            </div>
          </div>
        </div>

        {/* The Context */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">The Context</h3>
          
          <div className="bg-slate-950/60 rounded border border-slate-800 p-3 space-y-3">
            {dialogueLine ? (
              <>
                <div>
                  <div className="text-[9px] text-slate-600 uppercase tracking-wider mb-1">Original (EN)</div>
                  <div className="text-xs text-slate-300">{dialogueLine.enText}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-600 uppercase tracking-wider mb-1">Current Dub</div>
                  <textarea
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200 font-mono resize-none focus:outline-none focus:border-cyan-500"
                    rows={2}
                    defaultValue={dialogueLine.dubText}
                  />
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-500 italic">No dialogue line selected</div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Suggestions</h3>
          
          <div className="space-y-2">
            {suggestions.map(suggestion => (
              <div
                key={suggestion.id}
                className="bg-slate-950/60 rounded border border-slate-800 p-3 hover:border-purple-500/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
                      {suggestion.type}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600">
                    {(suggestion.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
                <p className="text-xs text-slate-300">{suggestion.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <Button variant="primary" size="sm" className="w-full">
            <CheckCircle className="w-4 h-4" />
            Mark as Acceptable Variance
          </Button>
          <Button variant="secondary" size="sm" className="w-full">
            <AlertCircle className="w-4 h-4" />
            Override Severity
          </Button>
          <Button variant="secondary" size="sm" className="w-full">
            <FileText className="w-4 h-4" />
            Add Note
          </Button>
        </div>
      </div>
    </div>
  );
}

// Missing Sparkles import fix
const Sparkles = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);