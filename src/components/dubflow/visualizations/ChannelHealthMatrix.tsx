/**
 * Channel Health Matrix
 * UI-only 6-box grid for audio channels
 */

import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function ChannelHealthMatrix() {
  const channels = [
    { name: 'L', label: 'Left', status: 'ok', level: 95 },
    { name: 'C', label: 'Center', status: 'ok', level: 98 },
    { name: 'R', label: 'Right', status: 'ok', level: 92 },
    { name: 'Ls', label: 'Left Surround', status: 'warning', level: 45 },
    { name: 'Rs', label: 'Right Surround', status: 'ok', level: 88 },
    { name: 'LFE', label: 'Low Frequency', status: 'error', level: 0 }
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-500/10 border-green-500/30';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30';
      case 'error':
        return 'bg-red-500/10 border-red-500/30';
      default:
        return 'bg-slate-800 border-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  return (
    <div className="p-4 bg-slate-900/40 rounded-lg border border-slate-800">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Channel Health Matrix
        </h4>
        <p className="text-[9px] text-slate-500 max-w-[55%] text-right leading-relaxed">
          6-channel audio status: green = active, yellow = low level, red = missing/silent
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {channels.map((ch) => (
          <div
            key={ch.name}
            className={`p-3 rounded-lg border ${getStatusStyle(ch.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">{ch.name}</span>
              {getStatusIcon(ch.status)}
            </div>
            
            <div className="text-[9px] text-slate-500 mb-2">{ch.label}</div>
            
            <div className="relative h-1.5 bg-slate-950/50 rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full ${
                  ch.status === 'ok' ? 'bg-green-400' :
                  ch.status === 'warning' ? 'bg-amber-400' :
                  'bg-red-400'
                }`}
                style={{ width: `${ch.level}%` }}
              />
            </div>
            
            <div className="text-[9px] text-slate-600 text-right mt-1 font-mono">
              {ch.level}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
