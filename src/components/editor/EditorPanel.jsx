/**
 * EditorPanel Component for OcularFlow v10.5
 * Complete subtitle editor panel
 */

import React from 'react';
import { PanelHeader } from '../atoms/Panel';
import { SubtitleTable } from './SubtitleTable';

/**
 * EditorPanel component
 * @param {Object} props
 */
export function EditorPanel({
  subtitles = [],
  currentIndex = 1,
  stats = null,
  filter = 'ALL',
  onSelectSubtitle,
  onTextChange,
  onFilterChange,
  autoScroll = true,
  className = ''
}) {
  // Filter buttons
  const filters = [
    { id: 'ALL', label: 'All', count: stats?.total || 0 },
    { id: 'ERRORS', label: 'Errors', count: stats?.withErrors || 0 },
    { id: 'WARNINGS', label: 'Warnings', count: stats?.withWarnings || 0 },
    { id: 'CLEAN', label: 'Clean', count: stats?.clean || 0 }
  ];
  
  return (
    <div className={`of-editor-panel ${className}`}>
      {/* Header */}
      <div className="of-editor-header">
        <div className="flex items-center gap-4">
          <span className="of-editor-title">Editor</span>
          
          {/* Filter buttons */}
          <div className="flex gap-1">
            {filters.map(f => (
              <button
                key={f.id}
                className={`
                  px-2 py-0.5 text-[9px] font-bold uppercase rounded border transition-colors
                  ${filter === f.id 
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                    : 'bg-transparent border-slate-700 text-slate-500 hover:text-slate-400'
                  }
                `}
                onClick={() => onFilterChange?.(f.id)}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>
        
        <div className="of-editor-stats">
          Segment {currentIndex} of {stats?.total || subtitles.length}
        </div>
      </div>
      
      {/* Table */}
      <SubtitleTable
        subtitles={subtitles}
        currentIndex={currentIndex}
        onSelectSubtitle={onSelectSubtitle}
        onTextChange={onTextChange}
        autoScroll={autoScroll}
      />
    </div>
  );
}

export default EditorPanel;
