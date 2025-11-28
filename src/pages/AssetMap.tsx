/**
 * AssetMap v1 - Card + Node Tree Views
 * Asset management interface for MediaQC
 */

import React, { useState } from 'react';
import { LayoutGrid, Network } from 'lucide-react';
import { CardView } from '../components/assetmap/CardView';
import { TreeView } from '../components/assetmap/TreeView';
import { Asset } from '../components/assetmap/AssetCard';

/**
 * Mock asset data
 */
const MOCK_ASSETS: Asset[] = [
  { id: "master-vid", name: "Master Video", type: "master", language: null, status: "OK" },
  { id: "en-dub", name: "English Dub", type: "audio", language: "EN", status: "Ready" },
  { id: "de-dub", name: "German Dub", type: "audio", language: "DE", status: "Ready" },
  { id: "en-sub", name: "EN Subtitles", type: "subtitle", language: "EN", status: "QC Required" },
  { id: "es-sub", name: "ES Subtitles", type: "subtitle", language: "ES", status: "QC Required" },
  { id: "metadata-fn", name: "Forced Narrative", type: "metadata", language: null, status: "OK" }
];

export default function AssetMap() {
  const [view, setView] = useState<"card" | "tree">("card");
  const titleName = "Demo Project Title";

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

      {/* Content Views */}
      {view === "card" ? (
        <CardView assets={MOCK_ASSETS} />
      ) : (
        <TreeView assets={MOCK_ASSETS} />
      )}
    </div>
  );
}
