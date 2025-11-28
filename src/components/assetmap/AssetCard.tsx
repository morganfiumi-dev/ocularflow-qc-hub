/**
 * AssetCard Component
 * Individual asset card for grid view
 */

import React from 'react';
import { Film, Mic, FileText, Layers } from 'lucide-react';

export interface Asset {
  id: string;
  name: string;
  type: 'master' | 'audio' | 'subtitle' | 'metadata';
  language: string | null;
  status: string;
}

interface AssetCardProps {
  asset: Asset;
  onClick: () => void;
}

export function AssetCard({ asset, onClick }: AssetCardProps) {
  const getTypeConfig = (type: string) => {
    const configs = {
      master: {
        icon: Film,
        color: 'text-slate-400',
        bg: 'bg-slate-700/30',
        border: 'border-slate-600'
      },
      audio: {
        icon: Mic,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30'
      },
      subtitle: {
        icon: FileText,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30'
      },
      metadata: {
        icon: Layers,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30'
      }
    };
    return configs[type as keyof typeof configs] || configs.master;
  };

  const config = getTypeConfig(asset.type);
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className="rounded-lg bg-slate-900/60 border border-slate-800 p-4 shadow-lg shadow-black/40 cursor-pointer hover:bg-slate-800 transition"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-md flex items-center justify-center ${config.bg} border ${config.border}`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-100 truncate">
            {asset.name}
          </h3>
          <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">
            {asset.type}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
        {asset.language ? (
          <span className="text-xs font-mono text-slate-400 uppercase">
            {asset.language}
          </span>
        ) : (
          <span className="text-xs text-slate-600">—</span>
        )}
        
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
          asset.status === 'OK' || asset.status === 'Ready'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
        }`}>
          {asset.status}
        </span>
      </div>
    </div>
  );
}
