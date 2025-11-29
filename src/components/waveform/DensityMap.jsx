/**
 * DensityMap Component for OcularFlow v10.5
 * Shows subtitle density across entire timeline
 */

import React, { useMemo } from 'react';

/**
 * DensityMap component - Mini timeline showing entire video
 * @param {Object} props
 */
export function DensityMap({
  subtitles = [],
  duration = 0,
  currentTime = 0,
  windowStart = 0,
  visibleWindow = 10,
  onSeek,
  className = ''
}) {
  // Calculate density bars (divide timeline into segments)
  const densityBars = useMemo(() => {
    if (duration === 0) return [];
    
    const barCount = 100; // Fixed number of bars for entire timeline
    const segmentDuration = duration / barCount;
    const bars = [];
    
    for (let i = 0; i < barCount; i++) {
      const segmentStart = i * segmentDuration;
      const segmentEnd = (i + 1) * segmentDuration;
      
      // Count subtitles in this segment
      const subsInSegment = subtitles.filter(sub => 
        (sub.startTime >= segmentStart && sub.startTime < segmentEnd) ||
        (sub.endTime > segmentStart && sub.endTime <= segmentEnd) ||
        (sub.startTime <= segmentStart && sub.endTime >= segmentEnd)
      );
      
      // Calculate coverage percentage
      let coverage = 0;
      subsInSegment.forEach(sub => {
        const overlapStart = Math.max(segmentStart, sub.startTime);
        const overlapEnd = Math.min(segmentEnd, sub.endTime);
        coverage += (overlapEnd - overlapStart) / segmentDuration;
      });
      
      bars.push({
        index: i,
        coverage: Math.min(1, coverage),
        hasIssues: subsInSegment.some(sub => sub.issues && sub.issues.length > 0)
      });
    }
    
    return bars;
  }, [subtitles, duration]);
  
  // Calculate viewport position
  const viewportLeft = (windowStart / duration) * 100;
  const viewportWidth = (visibleWindow / duration) * 100;
  const playheadPos = (currentTime / duration) * 100;
  
  // Handle click to seek
  const handleClick = (e) => {
    if (!onSeek || duration === 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const time = pct * duration;
    
    onSeek(time);
  };
  
  return (
    <div className={`of-density-map ${className}`} onClick={handleClick}>
      {/* Density bars */}
      <div className="of-density-bars">
        {densityBars.map(bar => (
          <div
            key={bar.index}
            className={`of-density-bar ${bar.hasIssues ? 'has-issues' : ''}`}
            style={{
              height: `${bar.coverage * 100}%`,
              opacity: bar.coverage > 0 ? 0.4 + (bar.coverage * 0.6) : 0.1
            }}
          />
        ))}
      </div>
      
      {/* Viewport indicator */}
      <div
        className="of-density-viewport"
        style={{
          left: `${viewportLeft}%`,
          width: `${viewportWidth}%`
        }}
      />
      
      {/* Playhead indicator */}
      <div
        className="of-density-playhead"
        style={{ left: `${playheadPos}%` }}
      />
      
      {/* Time labels */}
      <div className="of-density-labels">
        <span>00:00</span>
        <span>{formatTime(duration / 2)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

/**
 * Format time as MM:SS
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default DensityMap;
