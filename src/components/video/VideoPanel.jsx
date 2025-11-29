/**
 * VideoPanel Component for OcularFlow v10.5
 * Complete video panel with player and toolbar
 */

import React from 'react';
import { VideoPlayer } from './VideoPlayer';
import { VideoToolbar } from './VideoToolbar';

/**
 * VideoPanel component
 * @param {Object} props
 */
export function VideoPanel({
  // Video state
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  playbackRate = 1,
  volume = 0.75,
  muted = false,
  
  // Subtitle state
  currentSubtitle = null,
  contextType = 'DIALOGUE',
  
  // Callbacks
  onTogglePlayback,
  onSkipForward,
  onSkipBackward,
  onFrameForward,
  onFrameBackward,
  onSeek,
  onPlaybackRateChange,
  onVolumeChange,
  onToggleMute,
  onDurationChange,
  
  className = ''
}) {
  return (
    <div className={`of-video-panel ${className}`}>
      {/* Video Player */}
      <VideoPlayer
        currentSubtitle={currentSubtitle}
        contextType={contextType}
        isPlaying={isPlaying}
        currentTime={currentTime}
        playbackRate={playbackRate}
        volume={volume}
        muted={muted}
        onTimeUpdate={onSeek}
        onDurationChange={onDurationChange}
      />
      
      {/* Toolbar */}
      <VideoToolbar
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        volume={volume}
        muted={muted}
        onTogglePlayback={onTogglePlayback}
        onSkipForward={onSkipForward}
        onSkipBackward={onSkipBackward}
        onFrameForward={onFrameForward}
        onFrameBackward={onFrameBackward}
        onPlaybackRateChange={onPlaybackRateChange}
        onVolumeChange={onVolumeChange}
        onToggleMute={onToggleMute}
      />
    </div>
  );
}

export default VideoPanel;
