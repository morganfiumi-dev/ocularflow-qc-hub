/**
 * Timeline Component for OcularFlow v10.5
 * Waveform visualization with subtitle pills
 */

import React, { useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { calculatePillPosition } from '../../utils/waveformProcessing';

/**
 * Timeline component
 * @param {Object} props
 */
export function Timeline({
  waveformBars = [],
  subtitles = [],
  currentIndex = 1,
  windowStart = 0,
  visibleWindow = 10,
  playheadPct = 30,
  isolateDialogue = false,
  spectrogramMode = false,
  onSeek,
  onSubtitleClick,
  className = ''
}) {
  // Filter visible subtitles
  const visibleSubtitles = useMemo(() => {
    const windowEnd = windowStart + visibleWindow;
    return subtitles.filter(sub => 
      sub.endTime > windowStart && sub.startTime < windowEnd
    );
  }, [subtitles, windowStart, visibleWindow]);
  
  // Extract issue markers from visible subtitles
  const issueMarkers = useMemo(() => {
    return visibleSubtitles
      .filter(sub => sub.issues && sub.issues.length > 0)
      .map(sub => ({
        time: sub.startTime,
        issues: sub.issues,
        severity: sub.issues.reduce((max, issue) => {
          if (issue.severity === 'error') return 'error';
          if (max === 'error') return max;
          if (issue.severity === 'warning') return 'warning';
          return max === 'warning' ? max : 'info';
        }, 'info')
      }));
  }, [visibleSubtitles]);
  
  // Handle click to seek
  const handleClick = (e) => {
    if (!onSeek) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const time = windowStart + pct * visibleWindow;
    
    onSeek(time);
  };
  
  return (
    <div
      className={`of-waveform-content ${className}`}
      onClick={handleClick}
    >
      {/* Waveform bars */}
      <div className="of-waveform-bars">
        {waveformBars.map((height, i) => (
          <div
            key={i}
            className={`of-waveform-bar ${isolateDialogue ? 'isolated' : ''}`}
            style={{
              height: spectrogramMode ? '100%' : `${height * 100}%`,
              opacity: spectrogramMode ? height : 1,
              background: spectrogramMode 
                ? `linear-gradient(to top, rgb(30, 58, 138), rgb(6, 182, 212), rgb(250, 204, 21))`
                : undefined
            }}
          />
        ))}
      </div>
      
      {/* Subtitle pills */}
      <div className="of-subtitle-pills">
        {visibleSubtitles.map(sub => {
          const pos = calculatePillPosition(
            sub.startTime,
            sub.endTime,
            windowStart,
            visibleWindow
          );
          
          return (
            <div
              key={sub.index}
              className={`of-subtitle-pill ${sub.index === currentIndex ? 'active' : ''}`}
              style={{
                left: `${pos.left}%`,
                width: `${pos.width}%`
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSubtitleClick?.(sub.index);
              }}
            >
              {sub.text}
            </div>
          );
        })}
      </div>
      
      {/* Issue markers */}
      <div className="of-issue-markers">
        {issueMarkers.map((marker, idx) => {
          const position = ((marker.time - windowStart) / visibleWindow) * 100;
          
          return (
            <div
              key={`issue-${idx}`}
              className={`of-issue-marker severity-${marker.severity}`}
              style={{ left: `${position}%` }}
              title={`${marker.issues.length} issue${marker.issues.length > 1 ? 's' : ''}`}
            >
              <AlertCircle size={8} />
            </div>
          );
        })}
      </div>
      
      {/* Playhead */}
      <div
        className="of-playhead"
        style={{ left: `${playheadPct}%` }}
      />
    </div>
  );
}

export default Timeline;
