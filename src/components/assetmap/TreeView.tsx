/**
 * TreeView Component
 * Hierarchical node tree view of assets
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Film, Mic, FileText, Layers } from 'lucide-react';
import { Asset } from './AssetCard';

interface TreeViewProps {
  assets: Asset[];
}

export function TreeView({ assets }: TreeViewProps) {
  const navigate = useNavigate();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['master', 'audio', 'subtitle', 'metadata']));

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleAssetClick = (asset: Asset) => {
    if (asset.type === 'subtitle') {
      navigate('/ocularflow');
    } else if (asset.type === 'audio') {
      navigate(`/qc/dub/${asset.id}`);
    }
  };

  const masterAsset = assets.find(a => a.type === 'master');
  const audioAssets = assets.filter(a => a.type === 'audio');
  const subtitleAssets = assets.filter(a => a.type === 'subtitle');
  const metadataAssets = assets.filter(a => a.type === 'metadata');

  return (
    <div className="mt-6 space-y-4">
      {/* Master Video - Root */}
      {masterAsset && (
        <div className="space-y-2">
          <div className="px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-md text-sm hover:bg-slate-800 transition flex items-center gap-2">
            <Film className="w-4 h-4 text-slate-400" />
            <span className="text-slate-100 font-semibold">{masterAsset.name}</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-700/30 text-slate-400 border border-slate-600 ml-auto">
              {masterAsset.status}
            </span>
          </div>

          {/* Branches */}
          <div className="ml-6 pl-4 border-l border-slate-700 space-y-3">
            {/* Audio Tracks Branch */}
            {audioAssets.length > 0 && (
              <div>
                <button
                  onClick={() => toggleNode('audio')}
                  className="px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-md text-sm hover:bg-slate-800 transition flex items-center gap-2 w-full"
                >
                  {expandedNodes.has('audio') ? (
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  )}
                  <Mic className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-100 font-semibold">Audio Tracks</span>
                  <span className="text-xs text-slate-500 ml-auto">({audioAssets.length})</span>
                </button>

                {expandedNodes.has('audio') && (
                  <div className="ml-6 pl-4 border-l border-slate-700 mt-2 space-y-2">
                    {audioAssets.map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => handleAssetClick(asset)}
                        className="px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-md text-sm cursor-pointer hover:bg-slate-800 transition flex items-center gap-2"
                      >
                        <span className="text-slate-100">{asset.name}</span>
                        <span className="text-xs font-mono text-blue-400 uppercase">
                          {asset.language}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ml-auto">
                          {asset.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Subtitles Branch */}
            {subtitleAssets.length > 0 && (
              <div>
                <button
                  onClick={() => toggleNode('subtitle')}
                  className="px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-md text-sm hover:bg-slate-800 transition flex items-center gap-2 w-full"
                >
                  {expandedNodes.has('subtitle') ? (
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  )}
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-100 font-semibold">Subtitles</span>
                  <span className="text-xs text-slate-500 ml-auto">({subtitleAssets.length})</span>
                </button>

                {expandedNodes.has('subtitle') && (
                  <div className="ml-6 pl-4 border-l border-slate-700 mt-2 space-y-2">
                    {subtitleAssets.map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => handleAssetClick(asset)}
                        className="px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-md text-sm cursor-pointer hover:bg-slate-800 transition flex items-center gap-2"
                      >
                        <span className="text-slate-100">{asset.name}</span>
                        <span className="text-xs font-mono text-emerald-400 uppercase">
                          {asset.language}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 ml-auto">
                          {asset.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Metadata Branch */}
            {metadataAssets.length > 0 && (
              <div>
                <button
                  onClick={() => toggleNode('metadata')}
                  className="px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-md text-sm hover:bg-slate-800 transition flex items-center gap-2 w-full"
                >
                  {expandedNodes.has('metadata') ? (
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  )}
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-100 font-semibold">Metadata</span>
                  <span className="text-xs text-slate-500 ml-auto">({metadataAssets.length})</span>
                </button>

                {expandedNodes.has('metadata') && (
                  <div className="ml-6 pl-4 border-l border-slate-700 mt-2 space-y-2">
                    {metadataAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-md text-sm hover:bg-slate-800 transition flex items-center gap-2"
                      >
                        <span className="text-slate-100">{asset.name}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ml-auto">
                          {asset.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
