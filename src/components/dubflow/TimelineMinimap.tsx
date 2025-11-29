/**
 * TimelineMinimap - Overview of entire timeline with colored issue areas
 */

import React from 'react';

interface Issue {
  id: number;
  timeSeconds: number;
  severity: 'error' | 'warning' | 'info';
  categoryId: string;
}

interface TimelineMinimapProps {
  duration: number;
  currentTime: number;
  issues: Issue[];
  onSeek: (time: number) => void;
}

export function TimelineMinimap({
  duration,
  currentTime,
  issues,
  onSeek,
}: TimelineMinimapProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const time = percent * duration;
    onSeek(time);
  };

  const currentPercent = (currentTime / duration) * 100;

  return (
    <div className="h-full bg-slate-900/60 border border-slate-800 rounded-md shadow-lg shadow-black/40 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-8 px-3 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Timeline Overview
        </span>
        <span className="text-[9px] text-slate-600 font-mono">
          {issues.length} issues across {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
        </span>
      </div>

      {/* Timeline track */}
      <div 
        className="flex-1 relative bg-slate-950 cursor-pointer mx-3 my-2 rounded"
        onClick={handleClick}
      >
        {/* Issue markers - colored by category and severity */}
        {issues.map((issue) => {
          const position = (issue.timeSeconds / duration) * 100;
          
          // Determine color based on category
          let colorClass = 'bg-amber-500'; // default
          if (issue.categoryId === 'timing_sync') colorClass = 'bg-pink-500';
          else if (issue.categoryId === 'dialogue_integrity') colorClass = 'bg-purple-500';
          else if (issue.categoryId === 'translation') colorClass = 'bg-blue-500';
          else if (issue.categoryId === 'channel_integrity') colorClass = 'bg-green-500';
          
          // Adjust opacity by severity
          const opacity = issue.severity === 'error' ? 'opacity-90' : 
                         issue.severity === 'warning' ? 'opacity-60' : 'opacity-30';
          
          return (
            <div
              key={issue.id}
              className={`absolute top-0 bottom-0 w-1 ${colorClass} ${opacity} hover:opacity-100 transition-opacity`}
              style={{ left: `${position}%` }}
              title={`${issue.severity}: ${issue.timeSeconds.toFixed(1)}s`}
            />
          );
        })}

        {/* Current time indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
          style={{ left: `${currentPercent}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-400 rounded-full shadow-lg" />
        </div>
      </div>

      {/* Legend */}
      <div className="h-6 px-3 pb-1 border-t border-slate-800 flex items-center gap-3 flex-shrink-0 text-[9px] text-slate-600">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-pink-500 rounded-sm" />
          <span>Lip Sync</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-purple-500 rounded-sm" />
          <span>Dialogue</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-sm" />
          <span>Translation</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-amber-500 rounded-sm" />
          <span>Audio</span>
        </div>
      </div>
    </div>
  );
}
