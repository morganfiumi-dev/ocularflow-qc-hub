/**
 * Viseme Connector Strip
 * UI-only mouth-sync visualization
 */

import React from 'react';

export function VisemeConnector() {
  const phonemes = ['M', 'AH', 'N', 'IY', 'K'];
  const dubPhonemes = ['M', 'AH', 'N', 'EH', 'K']; // Mismatch at index 3

  return (
    <div className="p-4 bg-slate-900/40 rounded-lg border border-slate-800">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Lip Sync Analysis
        </h4>
        <p className="text-[9px] text-slate-500 max-w-[55%] text-right leading-relaxed">
          Compares mouth shapes (video) with phoneme sounds (audio). Red = mismatch.
        </p>
      </div>

      <div className="space-y-4">
        {/* Source */}
        <div>
          <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Original</div>
          <div className="flex items-center gap-2">
            {phonemes.map((ph, i) => (
              <div
                key={`src-${i}`}
                className={`flex-1 px-3 py-2 rounded text-center text-xs font-bold border ${
                  phonemes[i] !== dubPhonemes[i]
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300'
                }`}
              >
                {ph}
              </div>
            ))}
          </div>
        </div>

        {/* Connectors */}
        <div className="relative h-8">
          <svg className="w-full h-full" viewBox="0 0 500 32">
            {phonemes.map((_, i) => {
              const x = (i + 0.5) * 100;
              const isMatch = phonemes[i] === dubPhonemes[i];
              return (
                <line
                  key={i}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="32"
                  stroke={isMatch ? 'rgb(34 197 94)' : 'rgb(239 68 68)'}
                  strokeWidth="2"
                  strokeDasharray={isMatch ? '0' : '4 4'}
                />
              );
            })}
          </svg>
        </div>

        {/* Dub */}
        <div>
          <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Dub Track</div>
          <div className="flex items-center gap-2">
            {dubPhonemes.map((ph, i) => (
              <div
                key={`dub-${i}`}
                className={`flex-1 px-3 py-2 rounded text-center text-xs font-bold border ${
                  phonemes[i] !== dubPhonemes[i]
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300'
                }`}
              >
                {ph}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded">
        <p className="text-[10px] text-red-400">
          Phoneme mismatch detected at position 4: Expected "IY" but got "EH"
        </p>
      </div>
    </div>
  );
}
