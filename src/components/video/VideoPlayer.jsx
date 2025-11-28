/**
 * VideoPlayer Component for OcularFlow v10.5
 * Video stage with subtitle overlay
 */

import React from 'react';

/**
 * VideoPlayer component
 * @param {Object} props
 */
export function VideoPlayer({
  currentSubtitle = null,
  contextType = 'DIALOGUE',
  className = ''
}) {
  return (
    <div className={`of-video-stage ${className}`}>
      {/* Video placeholder */}
      <span className="of-video-placeholder">[ VIDEO SIGNAL ]</span>
      
      {/* Context type badge */}
      {contextType && contextType !== 'DIALOGUE' && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`
            px-2 py-0.5 rounded text-[9px] font-bold uppercase
            ${contextType === 'FN' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : ''}
            ${contextType === 'SONG' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : ''}
            ${contextType === 'CAPTION' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ''}
          `}>
            {contextType}
          </span>
        </div>
      )}
      
      {/* Subtitle overlay */}
      {currentSubtitle && (
        <div className="of-subtitle-overlay">
          <span className="of-subtitle-text">
            {currentSubtitle.text}
          </span>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
