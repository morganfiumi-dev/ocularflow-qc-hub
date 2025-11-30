/**
 * Timeline Annotations Component
 * Shows scene changes, songs, main titles, forced narratives on waveform
 */

import React from 'react';
import { Music, Film, Type, MessageSquare } from 'lucide-react';

interface Annotation {
  time: number;
  type: 'scene' | 'song' | 'on_screen_text' | 'forced_narrative';
  label: string;
}

interface TimelineAnnotationsProps {
  annotations: Annotation[];
  windowStart: number;
  visibleWindow: number;
  show: boolean;
}

export function TimelineAnnotations({
  annotations,
  windowStart,
  visibleWindow,
  show
}: TimelineAnnotationsProps) {
  if (!show) return null;

  const windowEnd = windowStart + visibleWindow;
  const visibleAnnotations = annotations.filter(
    ann => ann.time >= windowStart && ann.time <= windowEnd
  );

  const getIcon = (type: Annotation['type']) => {
    switch (type) {
      case 'scene': return <Film className="w-2.5 h-2.5" />;
      case 'song': return <Music className="w-2.5 h-2.5" />;
      case 'on_screen_text': return <Type className="w-2.5 h-2.5" />;
      case 'forced_narrative': return <MessageSquare className="w-2.5 h-2.5" />;
    }
  };

  const getColor = (type: Annotation['type']) => {
    switch (type) {
      case 'scene': return 'bg-purple-500/20 border-purple-500/40 text-purple-300';
      case 'song': return 'bg-pink-500/20 border-pink-500/40 text-pink-300';
      case 'on_screen_text': return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300';
      case 'forced_narrative': return 'bg-blue-500/20 border-blue-500/40 text-blue-300';
    }
  };

  return (
    <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none">
      {visibleAnnotations.map((ann, idx) => {
        const position = ((ann.time - windowStart) / visibleWindow) * 100;
        
        return (
          <div
            key={`${ann.type}-${idx}`}
            className="absolute top-0 bottom-0 pointer-events-auto"
            style={{ left: `${position}%` }}
          >
            {/* Vertical line */}
            <div className={`w-px h-full ${getColor(ann.type).replace('text-', 'bg-').replace('/20', '/30')}`} />
            
            {/* Label pill */}
            <div
              className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border whitespace-nowrap flex items-center gap-1 ${getColor(ann.type)}`}
              style={{ transform: 'translateX(-50%)' }}
            >
              {getIcon(ann.type)}
              {ann.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
