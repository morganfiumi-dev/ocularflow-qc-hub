/**
 * AssetMap v1 - Card + Node Tree Views
 * Asset management interface for MediaQC
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LayoutGrid, Network } from 'lucide-react';
import { CardView } from '../components/assetmap/CardView';
import { TreeView } from '../components/assetmap/TreeView';
import { Asset } from '../components/assetmap/AssetCard';
import { ContextPanel } from '../components/assetmap/ContextPanel';
import { trpc } from '../lib/trpc-mock';

export default function AssetMap() {
  const { titleId } = useParams<{ titleId: string }>();
  const [view, setView] = useState<"card" | "tree">("card");
  
  // Fetch project and asset tree from tRPC backend
  const { data: project, isLoading: projectLoading } = trpc.projects.get.useQuery(
    { id: titleId || '' },
    { enabled: !!titleId }
  );
  
  const { data: assetTree, isLoading: treeLoading } = trpc.assets.getTree.useQuery(
    { projectId: titleId || '' },
    { enabled: !!titleId }
  );
  
  const titleName = project?.name || 'Loading...';
  const assets: Asset[] = assetTree?.flatList.map(asset => ({
    id: asset.id,
    name: asset.name,
    type: asset.type,
    language: asset.language || null,
    status: asset.status === 'ready' ? 'Ready' : asset.status === 'qc-required' ? 'QC Required' : 'OK',
  })) || [];
  
  const isLoading = projectLoading || treeLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-cyan-500 font-mono animate-pulse text-lg">
          LOADING ASSET MAP...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
          MEDIAQC
        </p>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Asset Map for <span className="text-cyan-400">{titleName}</span>
          </h1>

          {/* View Toggle */}
          <div className="flex bg-slate-900/60 border border-slate-800 rounded-md overflow-hidden">
            <button
              onClick={() => setView("card")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors ${
                view === "card"
                  ? "bg-slate-800 text-slate-100"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Card View
            </button>
            <button
              onClick={() => setView("tree")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors ${
                view === "tree"
                  ? "bg-slate-800 text-slate-100"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Network className="w-4 h-4" />
              Node Tree View
            </button>
          </div>
        </div>
      </div>

      {/* Context Panel */}
      <ContextPanel titleId={titleId || ''} />

      {/* Content Views */}
      {view === "card" ? (
        <CardView assets={assets} />
      ) : (
        <TreeView assets={assets} />
      )}
    </div>
  );
}
